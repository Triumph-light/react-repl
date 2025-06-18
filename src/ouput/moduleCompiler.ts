import { File, ReplStore } from "../component/repl/storeContext";
import { transform } from "@babel/standalone";
import { type NodePath } from "@babel/traverse";
import type { ExportDefaultDeclaration, Identifier, ImportDeclaration, ExportNamedDeclaration, ExportAllDeclaration } from "@babel/types";
import MagicString from "magic-string";

const modulesKey = '__modules__'
const moduleKey = '__module__'
const exportKey = '__export__'

export function compileModulesForPreview(store: ReplStore) {
    const processed: string[] = []
    const seen = new Set<File>()
    processFile(store, store.files[store.mainFile], processed, seen)

    return processed
}

function processFile(store: ReplStore, file: File, processed: string[], seen: Set<File>) {
    if (seen.has(file)) {
        return
    }
    seen.add(file)

    const { code: js, importedFiles } = processModule(store, file.filename)
    processChildFiles(store, importedFiles, processed, seen)

    processed.push(js)
}

function processChildFiles(store: ReplStore, importedFiles: Set<string>, processed: string[], seen: Set<File>) {
    for (const filename of importedFiles) {
        processFile(store, store.files[filename], processed, seen)
    }
}

/**
 * todo: 模块解析这里是否能优化，解析了两次
 */
function processModule(store: ReplStore, filename: string) {
    function defineExport(name: string, local = name) {
        s.append(`\n${exportKey}(${moduleKey}, "${name}", () => ${local})`)
    }
    const rawCode = store.files[filename].code
    const s = new MagicString(rawCode)

    const importedFiles = new Set<string>()

    let code = transform(rawCode, {
        presets: ['react'],
        plugins: [() => {
            return {
                visitor: {
                    ExportAllDeclaration(path: NodePath<ExportAllDeclaration>) {
                        const { node } = path
                        const modulePath = node.source.value.replace(/\.\//, '')
                        importedFiles.add(modulePath)
                        s.overwrite(node.start!, node.end!, `for (const key in ${modulesKey}["${modulePath}"]) {
                            if (key !== 'default') {
                                ${moduleKey}[key] = ${modulesKey}["${modulePath}"][key]
                            }
                        }`)
                    },
                    ExportDefaultDeclaration(path: NodePath<ExportDefaultDeclaration>) {
                        const { node } = path
                        s.append(`${moduleKey}.default = ${(node.declaration as Identifier).name}\n`)
                        s.remove(node.start!, node.end!)
                    },
                    ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {
                        const { node } = path

                        if (node.declaration) {
                            // export const age = 18, name = 'xxx'
                            if (node.declaration.type === 'VariableDeclaration') {
                                for (const decl of node.declaration.declarations) {
                                    const varName = decl.id.name
                                    s.append(`\n ${moduleKey}.${varName} = ${varName}`)
                                }
                            }
                            // export function get(){}, export class Person{}
                            else if (node.declaration.type === 'ClassDeclaration' || node.declaration.type === 'FunctionDeclaration') {
                                const varName = node.declaration.id?.name
                                s.append(`\n ${moduleKey}.${varName} = ${varName}`)
                            }
                            s.remove(node.start!, node.declaration.start!)
                        }
                        // export { foo, bar } from './foo'
                        else if (node.source) {
                            const modulePath = node.source.value.replace(/\.\//, '')
                            const expandNames = node.specifiers?.map(specifier => specifier.local.name)
                            if (expandNames && expandNames.length !== 0) s.overwrite(node.start!, node.end!, `const { ${expandNames.join(',')} } =  ${modulesKey}["${modulePath}"]`)
                            for (const specifier of node.specifiers) {
                                const varName = specifier.local.name
                                s.appendRight(node.end!, `\n ${moduleKey}.${varName} = ${varName}`)
                            }
                            s.remove(node.start!, node.end!)
                        }
                        // export { name, age }
                        else {
                            for (const specifier of node.specifiers) {
                                const varName = specifier.local.name
                                s.append(`\n ${moduleKey}.${varName} = ${varName}`)
                            }
                            s.remove(node.start!, node.end!)
                        }
                    },
                    ImportDeclaration(path: NodePath<ImportDeclaration>) {
                        const { node } = path
                        const importDefault = node.specifiers.find(specifier => specifier.type === 'ImportDefaultSpecifier')

                        if (node.source.value.startsWith('./')) {
                            const modulePath = node.source.value.replace(/^\.\//, '')
                            importedFiles.add(modulePath)
                            // import foo from 'xx'
                            if (importDefault) {
                                const moduleName = importDefault.local.name
                                s.overwrite(node.start!, node.end!, `const ${moduleName} = ${modulesKey}["${modulePath}"].default\n`)
                            }

                            const nameSpaceObj = node.specifiers.find(specifier => specifier.type === 'ImportNamespaceSpecifier')
                            if (nameSpaceObj) {
                                s.overwrite(node.start!, node.end!, `const ${nameSpaceObj.local.name} = ${modulesKey}["${modulePath}"]`)
                            } else {
                                // import { foo } from 'xx'
                                const expandNames = node.specifiers?.map(specifier => specifier.local.name)
                                if (expandNames && expandNames.length !== 0) s.overwrite(node.start!, node.end!, `const { ${expandNames.join(',')} } =  ${modulesKey}["${modulePath}"]`)
                            }

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
