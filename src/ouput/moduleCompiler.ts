import { File, ReturnStore } from "../component/repl/storeContext";
import { transform } from "@babel/standalone";
import resolveImport from './resolveImport'

const modulesKey = '__modules__'

export function compileModulesForPreview(store: ReturnStore) {
    const processed: string[] = []
    processFile(store, store.files[store.mainFile], processed)

    return processed
}

function processFile(store: ReturnStore, file: File, processed: string[]) {
    let { code: js } = processModule(store, file.filename)

    processed.push(js)
}

function processModule(store: ReturnStore, filename: string) {
    const code = transform(store.files[filename].code, {
        presets: ['react'],
        plugins: [resolveImport()]
    }).code
    const importedFiles = new Set<string>()
    return {
        code,
        importedFiles
    }
}