import React, { useContext } from "react";
import MonaceEditor from "../../monaco/index";
import StoreContext from "../../component/repl/storeContext";
import FileSelector from "../file-selector";

const EditorContainer = () => {
  const store = useContext(StoreContext);
  const onChange = (code: string) => {
    console.log("code", store, code);
    store.setValue({
      activeFile: {
        code: code,
      },
    });
  };

  return (
    <>
      <FileSelector></FileSelector>
      <MonaceEditor onChange={onChange}></MonaceEditor>
    </>
  );
};

export default EditorContainer;
