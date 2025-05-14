import { File, ReturnStore } from "../component/repl/storeContext";
import { transform } from "@babel/standalone";
import { type NodePath } from "@babel/traverse";
import type { Program, ExportDefaultDeclaration, Identifier } from "@babel/types";
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
                    Program(path: NodePath<Program>) {
                        const body = path.node.body;
                        const index = body.findIndex(node => node.type === 'ExportDefaultDeclaration');

                        if (index !== -1) {
                            const exportDecl = body[index] as ExportDefaultDeclaration;
                            const exportedId = (exportDecl.declaration as Identifier).name;

                            s.append(`${moduleKey}.default = ${exportedId}\n`)
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
