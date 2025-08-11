import { createContext } from "react";
import type { Actions } from "ahooks/lib/useToggle";

const AutoSaveContext = createContext<
  { autoSave: boolean; setAutoSave: Actions<boolean>["set"] } | undefined
>(undefined);
export default AutoSaveContext;
