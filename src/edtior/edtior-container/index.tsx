import { useContext } from "react";
import MonaceEditor from "../../monaco/index.tsx";
import StoreContext from "../../component/repl/storeContext";
import FileSelector from "../file-selector/index.tsx";
import ToggleButton from "../../component/ToggleButton/index.tsx";
import AutoSaveContext from "../../component/repl/autoSaveContext.ts";
import "./index.less";
import { useDebounceFn } from "ahooks";

const EditorContainer = () => {
  const { updateFile, activeFile } = useContext(StoreContext);
  const { autoSave, setAutoSave } = useContext(AutoSaveContext)!

  const { run: onChange } = useDebounceFn((code: string) => {
    updateFile(code);
  }, {
    wait: 100
  })

  let language: string
  if (activeFile.filename.endsWith('.tsx') || activeFile.filename.endsWith('.ts')) {
    language = 'typescript'
  } else if (activeFile.filename.endsWith('.jsx') || activeFile.filename.endsWith('.js')) {
    language = 'javascript'
  } else {
    language = activeFile.filename.split('.')[1]
  }

  return (
    <>
      <FileSelector></FileSelector>
      <div className="editor-container">
        <MonaceEditor key={activeFile.filename} onChange={onChange} value={activeFile?.code} language={language}></MonaceEditor>

        <div className="editor-floating">
          <ToggleButton text="AutoSave" value={autoSave} onChange={(value) => {
            setAutoSave(value)
          }} />
        </div>
      </div>
    </>
  );
};

export default EditorContainer;
