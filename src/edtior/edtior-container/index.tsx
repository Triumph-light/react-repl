import { useContext } from "react";
import MonaceEditor from "../../monaco/index.tsx";
import StoreContext from "../../component/repl/storeContext";
import FileSelector from "../file-selector/index.tsx";
import ToggleButton from "../../component/ToggleButton/index.tsx";

const EditorContainer = () => {
  const { updateFile, activeFile } = useContext(StoreContext);

  const onChange = (code: string) => {
    updateFile(code);
  };

  return (
    <>
      <FileSelector></FileSelector>
      <MonaceEditor key={activeFile.filename} onChange={onChange} value={activeFile?.code}></MonaceEditor>

      <div style={{ "position": "absolute", "bottom": "16px", "right": "16px", "zIndex": "11", "display": "flex", "flexDirection": "column", "alignItems": "end", "gap": "8px", "backgroundColor": "var(--bg)", "color": "var(--text-light)", "padding": "8px" }}>
        <ToggleButton text="AutoSave" />
      </div>
    </>
  );
};

export default EditorContainer;
