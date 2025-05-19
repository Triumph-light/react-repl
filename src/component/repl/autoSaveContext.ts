import { Actions } from 'ahooks/lib/useToggle';
import { createContext } from 'react';

const AutoSaveContext = createContext<{ autoSave: boolean, toggleAutoSave: Actions<boolean>['toggle'] }>();
export default AutoSaveContext