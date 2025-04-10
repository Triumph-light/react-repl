import React, { useContext } from "react";
import MonaceEditor from "../../monaco/index";
import StoreContext from "../../component/repl/storeContext";

const EditorContainer = () => {
  const { store, setStore } = useContext(StoreContext);
  const onChange = (code: string) => {
    console.log("code", store, code);
    setStore({
      activeFile: {
        code: code,
      },
    });
  };

  return (
    <>
      <MonaceEditor onChange={onChange}></MonaceEditor>
    </>
  );
};

export default EditorContainer;
