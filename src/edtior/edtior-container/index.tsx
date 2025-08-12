import { useDebounceFn } from "ahooks";
import { useContext } from "react";
import AutoSaveContext from "../../component/repl/autoSaveContext.ts";
import StoreContext from "../../component/repl/storeContext";
import ToggleButton from "../../component/ToggleButton/index.tsx";
import MonaceEditor from "../../monaco/index.tsx";
import FileSelector from "../file-selector/index.tsx";
import "./index.less";

const EditorContainer = () => {
  const { updateFile, activeFile } = useContext(StoreContext);
  const { autoSave, setAutoSave } = useContext(AutoSaveContext)!;

  const { run: onChange } = useDebounceFn(
    (code: string) => {
      updateFile(code);
    },
    {
      wait: 100,
    },
  );

  return (
    <>
      <FileSelector></FileSelector>
      <div className="editor-container">
        <MonaceEditor
          onChange={onChange}
          value={activeFile?.code}
          language={activeFile.language}
        ></MonaceEditor>

        <div className="editor-floating">
          <ToggleButton
            text="AutoSave"
            value={autoSave}
            onChange={(value) => {
              setAutoSave(value);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default EditorContainer;
