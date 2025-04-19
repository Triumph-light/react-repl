import { createContext, useState } from "react";
import welcomeCode from '../../template/welcome.jsx?raw'
import templateCode from '../../template/template.jsx?raw'

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

}

type StoreValue = Pick<ReturnStore, | 'files' | 'activeFilename'>

export function useStore({
    files = undefined,
    template = {
        welcomeCode,
        templateCode
    },
    mainFile = 'App.jsx',
    activeFilename = undefined
}: Partial<StoreParams> = {}): ReturnStore {
    function init() {

    }

    const [value, setValue] = useState<StoreValue>(() => {
        files = files || {
            [mainFile]: new File(mainFile, template.welcomeCode)
        }
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

        if (activeFilenameValue === filename) {
            setValue({
                ...value,
                activeFilename: mainFile
            })
        }

        const newFiles = { ...filesValue }
        delete newFiles[filename]
        setValue({ ...value, files: newFiles })
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

    const setActive: ReturnStore['setActive'] = () => {

    }



    return {
        ...value,
        activeFile,
        template,
        mainFile,
        addFile,
        deleteFile,
        renameFile,
        updateFile,
        setActive
    }
}

const StoreContext = createContext<ReturnStore>({} as ReturnStore);

export default StoreContext