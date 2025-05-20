import { useContext } from "react";
import MonaceEditor from "../../monaco/index";
import StoreContext from "../../component/repl/storeContext";
import FileSelector from "../file-selector";
import ToggleButton from "../../component/ToggleButton";

const EditorContainer = () => {
  const { updateFile, activeFile } = useContext(StoreContext);

  const onChange = (code: string) => {
    updateFile(code);
  };

  return (
    <>
      <FileSelector></FileSelector>
      <MonaceEditor onChange={onChange} value={activeFile?.code}></MonaceEditor>

      <div style={{ "position": "absolute", "bottom": "16px", "right": "16px", "zIndex": "11", "display": "flex", "flexDirection": "column", "alignItems": "end", "gap": "8px", "backgroundColor": "var(--bg)", "color": "var(--text-light)", "padding": "8px" }}>
        <ToggleButton />
      </div>
    </>
  );
};

export default EditorContainer;
