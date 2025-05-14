import { useContext } from "react";
import MonaceEditor from "../../monaco/index";
import StoreContext from "../../component/repl/storeContext";
import FileSelector from "../file-selector";

const EditorContainer = () => {
  const { updateFile, activeFile } = useContext(StoreContext);

  const onChange = (code: string) => {
    updateFile(code);
  };

  return (
    <>
      <FileSelector></FileSelector>
      <MonaceEditor onChange={onChange} value={activeFile?.code}></MonaceEditor>
    </>
  );
};

export default EditorContainer;
