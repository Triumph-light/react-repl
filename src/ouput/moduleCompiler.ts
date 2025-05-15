import { File, ReturnStore } from "../component/repl/storeContext";
import { transform } from "@babel/standalone";
import { type NodePath } from "@babel/traverse";
import type { ExportDefaultDeclaration, Identifier, ImportDeclaration } from "@babel/types";
import MagicString from "magic-string";

const modulesKey = '__modules__'
const moduleKey = '__module__'

export function compileModulesForPreview(store: ReturnStore) {
    const processed: string[] = []
    processFile(store, store.files[store.mainFile], processed)

    return processed
}

function processFile(store: ReturnStore, file: File, processed: string[]) {
    const { code: js } = processModule(store, file.filename)

    processed.push(js)
}

/**
 * todo: 模块解析这里是否能优化，解析了两次
 */
function processModule(store: ReturnStore, filename: string) {
    const rawCode = store.files[filename].code
    const s = new MagicString(rawCode)

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

                        if (/^\.\//.test(node.source.value)) {
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

    const importedFiles = new Set<string>()
    return {
        code,
        importedFiles
    }
}
