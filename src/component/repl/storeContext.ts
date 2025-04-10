import { RefObject, createContext } from "react";

export type StoreType = {
    activeFile: {
        code: string;
    };
};

const StoreContext = createContext(null);

export default StoreContext