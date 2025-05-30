import { useContext } from "react";
import MonaceEditor from "../../monaco/index.tsx";
import StoreContext from "../../component/repl/storeContext";
import FileSelector from "../file-selector/index.tsx";
import ToggleButton from "../../component/ToggleButton/index.tsx";
import AutoSaveContext from "../../component/repl/autoSaveContext.ts";
import "./index.less";

const EditorContainer = () => {
  const { updateFile, activeFile } = useContext(StoreContext);
  const { autoSave, setAutoSave } = useContext(AutoSaveContext)

  const onChange = (code: string) => {
    updateFile(code);
  };

  return (
    <>
      <FileSelector></FileSelector>
      <div className="editor-container">
        <MonaceEditor key={activeFile.filename} onChange={onChange} value={activeFile?.code}></MonaceEditor>

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
