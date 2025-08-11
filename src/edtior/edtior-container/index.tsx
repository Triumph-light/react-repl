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
  const extension = activeFile.filename.split('.')[1]
  switch (extension) {
    case 'tsx':
    case 'ts':
      language = 'typescript'
      break;
    case 'jsx':
    case 'js':
      language = 'javascript'
      break;
    default:
      language = extension
  }

  return (
    <>
      <FileSelector></FileSelector>
      <div className="editor-container">
        <MonaceEditor onChange={onChange} value={activeFile?.code} language={language}></MonaceEditor>

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
