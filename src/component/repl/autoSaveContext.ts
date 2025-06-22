import { Actions } from 'ahooks/lib/useToggle';
import { createContext } from 'react';

const AutoSaveContext = createContext<{ autoSave: boolean, setAutoSave: Actions<boolean>['set'] } | undefined>(undefined);
export default AutoSaveContext