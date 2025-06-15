import { createContext } from "react";
import welcomeCode from "../../template/welcome.jsx?raw";
import templateCode from "../../template/template.jsx?raw";
import { ImportMap, mergeImportMap, useReactImportMap } from "../../import-map";
import { useCreation, useMount, useUpdate } from "ahooks";
import { atou, utoa } from "../../utils";

export class File {
    constructor(public filename: string, public code: string) { }

    get language() {
        if (this.filename.endsWith(".tsx") || this.filename.endsWith(".ts"))
            return "typescript";
        return "javascript";
    }
}

type StoreParams = {
    /** file system */
    files: Record<string, File>;
    template: {
        welcomeCode: string;
        templateCode: string;
    };
    mainFile: string;
    activeFilename: string;
    builtinImportMap: ImportMap;
};

export type Subscribe = () => void;

export const importMapFile = "import-map.json";
export class ReplStore {
    /**
     * file system
     */
    files: StoreParams['files'];
    mainFile: StoreParams['mainFile'];
    activeFilename: StoreParams['activeFilename'];
    template: StoreParams['template']

    version: number = 0
    private update: () => void

    constructor(
        {
            files = undefined,
            template = {
                welcomeCode,
                templateCode,
            },
            mainFile = "App.jsx",
            activeFilename = undefined,
            builtinImportMap = undefined!,
        }: Partial<StoreParams> = {},
        update: Subscribe
    ) {
        this.files = files || {
            [mainFile]: new File(mainFile, template.welcomeCode),
        };
        this.files[importMapFile] = new File(
            importMapFile,
            JSON.stringify(builtinImportMap, null, 2)
        );
        this.mainFile = mainFile
        this.activeFilename = activeFilename || mainFile;
        this.template = template;

        this.update = () => {
            this.version++
            update()
        }
    }

    get activeFile() {
        return this.files[this.activeFilename];
    }

    addFile: (fileOrFilename: string | File) => void = (fileOrFilename) => {
        let file: File;
        if (typeof fileOrFilename === "string") {
            file = new File(fileOrFilename, this.template.templateCode);
        } else {
            file = fileOrFilename;
        }

        this.files[file.filename] = file;
        this.update();
    };

    deleteFile: (filename: string) => void = (filename) => {
        if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

        delete this.files[filename];

        if (this.activeFilename === filename) {
            this.activeFilename = this.mainFile
        }

        this.update()
    };

    renameFile: (oldFilename: string, newFilename: string) => void = (oldFilename, newFilename) => {
        const file = this.files[oldFilename];

        if (!file) {
            return;
        }
        if (!newFilename && newFilename === oldFilename) {
            return;
        }

        const newFiles: Record<string, File> = {};

        for (const [name, file] of Object.entries(this.files)) {
            if (name === oldFilename) {
                newFiles[newFilename] = file;
            } else {
                newFiles[name] = file;
            }
        }
        this.files = newFiles;

        if (this.activeFilename === oldFilename) {
            this.activeFilename = newFilename
        }

        this.update()
    };

    updateFile: (code: string) => void = (code) => {
        this.files[this.activeFilename].code = code;
        this.update()
    };

    setActive: (filename: string) => void = (filename) => {
        this.activeFilename = filename
        this.update()
    };

    getImportMap: () => ImportMap = () => {
        try {
            return JSON.parse(this.files[importMapFile].code);
        } catch (e) {
            console.log(e);
        }
        return {};
    };

    setImportMap: (map: ImportMap) => void = (map: ImportMap) => {
        if (map.imports) {
            for (const [key, value] of Object.entries(map.imports)) {
                map.imports[key] = value;
            }
        }
        const code = JSON.stringify(map, undefined, 2);
        if (this.files[importMapFile]) {
            this.files[importMapFile].code = code;
        } else {
            this.files[importMapFile] = new File(importMapFile, code);
        }

        this.update()
    };

    serialize: () => string = () => {
        return "#" + utoa(JSON.stringify(this.files));
    };
    deserialize: (serializedState: string) => void = (serializedState: string) => {
        if (serializedState.startsWith("#")) {
            serializedState = serializedState.slice(1);
        }

        let saved: any;
        try {
            saved = JSON.parse(atou(serializedState));
        } catch (err) {
            console.error(err);
            alert("Failed to load code from URL.");
        }

        for (const filename in saved) {
            setFile(this.files, filename, saved[filename].code);
        }

        this.update()
    };
}

export function useStore(storeParams: Partial<StoreParams> = {}, serializedState?: string) {
    const { importMap } = useReactImportMap()

    const update = useUpdate()
    const replStoreInstance = useCreation(() => {
        return new ReplStore({ ...storeParams, builtinImportMap: importMap }, update);
    }, [])

    useMount(() => {
        if (serializedState) replStoreInstance.deserialize(serializedState)
    })
    return replStoreInstance
}

function setFile(
    files: Record<string, File>,
    filename: string,
    content: string
) {
    files[filename] = new File(filename, content);
}

const StoreContext = createContext<ReplStore>({} as ReplStore);

export default StoreContext;
