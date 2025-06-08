import { createContext, useState } from "react";
import welcomeCode from '../../template/welcome.jsx?raw'
import templateCode from '../../template/template.jsx?raw'
import { ImportMap, mergeImportMap, useReactImportMap } from "../../import-map";
import { useMount } from "ahooks";

export class File {
    constructor(public filename: string, public code: string) { }

    get language() {
        if (this.filename.endsWith(".tsx") || this.filename.endsWith(".ts"))
            return "typescript"
        return "javascript";
    }
}

export interface ReturnStore extends StoreParams {
    activeFile: File;

    addFile: (fileOrFilename: string | File) => void;
    deleteFile: (filename: string) => void
    renameFile: (oldFilename: string, newFilename: string) => void
    updateFile: (code: string) => void
    setActive: (filename: string) => void

    getImportMap(): ImportMap
};

type StoreParams = {
    /** file system */
    files: Record<string, File>
    template: {
        welcomeCode: string,
        templateCode: string
    }
    mainFile: string
    activeFilename: string
    builtinImportMap: ImportMap

}

type StoreValue = Pick<ReturnStore, | 'files' | 'activeFilename'>

export const importMapFile = 'import-map.json'

export function useStore({
    files = undefined,
    template = {
        welcomeCode,
        templateCode
    },
    mainFile = 'App.jsx',
    activeFilename = undefined,
    builtinImportMap = undefined!
}: Partial<StoreParams> = {}): ReturnStore {
    ({ importMap: builtinImportMap } = useReactImportMap())

    const [value, setValue] = useState<StoreValue>(() => {
        files = files || {
            [mainFile]: new File(mainFile, template.welcomeCode)
        }
        files[importMapFile] = new File(importMapFile, JSON.stringify(builtinImportMap, null, 2))
        return {
            files,
            activeFilename: activeFilename || mainFile
        }
    });

    const { files: filesValue, activeFilename: activeFilenameValue } = value
    const activeFile = filesValue[activeFilenameValue]

    const addFile: ReturnStore['addFile'] = (fileOrFilename) => {
        let file: File
        if (typeof fileOrFilename === 'string') {
            file = new File(fileOrFilename, templateCode)
        } else {
            file = fileOrFilename
        }

        const newFiles = { ...filesValue }
        newFiles[file.filename] = file
        setValue({
            ...value,
            files: newFiles
        })
    }

    const deleteFile: ReturnStore['deleteFile'] = (filename) => {
        if (
            !confirm(`Are you sure you want to delete ${filename}?`)
        ) return

        const newFiles = {}
        for (const key in filesValue) {
            if (filename === key) {
                continue
            }
            newFiles[key] = filesValue[key]
        }

        if (activeFilenameValue === filename) {
            setValue({
                activeFilename: mainFile,
                files: newFiles
            })
            return
        } else {
            setValue({ ...value, files: newFiles })
        }


    }

    const renameFile: ReturnStore['renameFile'] = (oldFilename, newFilename) => {
        const file = filesValue[oldFilename]

        if (!file) {
            return
        }
        if (!newFilename && newFilename === oldFilename) {
            return
        }

        const newFiles: Record<string, File> = {}

        for (const [name, file] of Object.entries(filesValue)) {
            if (name === oldFilename) {
                newFiles[newFilename] = file
            } else {
                newFiles[name] = file
            }
        }

        setValue({
            ...value,
            files: newFiles
        })

        if (activeFilenameValue === oldFilename) {
            setValue({
                ...value,
                activeFilename: newFilename
            })
        }
    }

    const updateFile: ReturnStore['updateFile'] = (code) => {
        const newFiles = { ...filesValue }
        newFiles[activeFilenameValue].code = code
        setValue({
            ...value,
            files: newFiles
        })
    }

    const setActive: ReturnStore['setActive'] = (filename) => {
        setValue({
            ...value,
            activeFilename: filename
        })
    }

    const getImportMap = () => {
        try {
            return JSON.parse(filesValue[importMapFile].code)
        } catch (e) {
            console.log(e)
        }
        return {}
    }
    const setImportMap = (map: ImportMap) => {
        if (map.imports) {
            for (const [key, value] of Object.entries(map.imports)) {
                map.imports[key] = value
            }
        }
        const code = JSON.stringify(map, undefined, 2)
        const newFiles = { ...filesValue }
        if (filesValue[importMapFile]) {
            newFiles[importMapFile].code = code
        } else {
            newFiles[importMapFile] = new File(importMapFile, code)
        }

        setValue({
            ...value,
            files: newFiles
        })
    }
    const applyBuiltinImportMap = (builtinImportMap: ImportMap) => {
        const importMap = mergeImportMap(builtinImportMap, getImportMap())
        setImportMap(importMap)
    }
    ({ importMap: builtinImportMap } = useReactImportMap())
    useMount(() => {
        applyBuiltinImportMap(builtinImportMap)
    })

    return {
        ...value,
        activeFile,
        template,
        mainFile,
        addFile,
        deleteFile,
        renameFile,
        updateFile,
        setActive,
        builtinImportMap,
        getImportMap
    }
}

const StoreContext = createContext<ReturnStore>({} as ReturnStore);

export default StoreContext