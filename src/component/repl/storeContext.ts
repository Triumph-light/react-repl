import { createContext, useState } from "react";

export class File {
    constructor(public filename: string, public code: string) { }

    get language() {
        if (this.filename.endsWith(".tsx") || this.filename.endsWith(".ts"))
            return "typescript"
        return "javascript";
    }
}

export type StoreType = {
    activeFile: {
        code: string;
    };
    files: Record<string, File>;
};

export function useStore() {
    const [value, setValue] = useState<StoreType>({
        activeFile: {
            code: ''
        }
    });

    return {
        value,
        setValue
    }
}

const StoreContext = createContext(null);

export default StoreContext