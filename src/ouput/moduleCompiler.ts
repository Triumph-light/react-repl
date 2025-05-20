import { File, ReturnStore } from "../component/repl/storeContext";
import { transform } from "@babel/standalone";
import { type NodePath } from "@babel/traverse";
import type { ExportDefaultDeclaration, Identifier, ImportDeclaration } from "@babel/types";
import MagicString from "magic-string";

const modulesKey = '__modules__'
const moduleKey = '__module__'

export function compileModulesForPreview(store: ReturnStore) {
    const processed: string[] = []
    const seen = new Set<File>()
    processFile(store, store.files[store.mainFile], processed, seen)

    return processed
}

function processFile(store: ReturnStore, file: File, processed: string[], seen: Set<File>) {
    if (seen.has(file)) {
        return
    }
    seen.add(file)

    const { code: js, importedFiles } = processModule(store, file.filename)
    processChildFiles(store, importedFiles, processed, seen)

    processed.push(js)
}

function processChildFiles(store: ReturnStore, importedFiles: Set<string>, processed: string[], seen: Set<File>) {
    for (const filename of importedFiles) {
        processFile(store, store.files[filename], processed, seen)
    }
}

/**
 * todo: 模块解析这里是否能优化，解析了两次
 */
function processModule(store: ReturnStore, filename: string) {
    const rawCode = store.files[filename].code
    const s = new MagicString(rawCode)

    const importedFiles = new Set<string>()

    let code = transform(rawCode, {
        presets: ['react'],
        plugins: [() => {
            return {
                visitor: {
                    ExportDefaultDeclaration(path: NodePath<ExportDefaultDeclaration>) {
                        const { node } = path
                        s.append(`${moduleKey}.default = ${(node.declaration as Identifier).name}\n`)
                    },
                    ImportDeclaration(path: NodePath<ImportDeclaration>) {
                        const { node } = path
                        const importDefault = node.specifiers.find(specifier => specifier.type === 'ImportDefaultSpecifier')
                        const moduleName = importDefault?.local.name
                        const modulePath = node.source.value.replace(/^\.\//, '')

                        if (node.source.value.startsWith('./')) {
                            importedFiles.add(modulePath)
                            s.overwrite(node.start!, node.end!, `const ${moduleName} = ${modulesKey}["${modulePath}"].default\n`)
                        }

                    }
                }
            }
        }]
    }).code!

    code = transform(s.toString(), {
        presets: ['react'],
    }).code!

    code = `const ${moduleKey} = ${modulesKey}[${JSON.stringify(
        filename,
    )}] = { [Symbol.toStringTag]: "Module" }\n\n` + code

    return {
        code,
        importedFiles
    }
}
