import React, { useRef } from "react";
import Layout from "../../layout";
import Preview from "../../ouput/preview/index.tsx";
import EditorContainer from "../../edtior/edtior-container/index.tsx";
import "./index.less";
import { OutputContext } from "../../ouput/outputContext";
import StoreContext, { useStore } from "./storeContext";
import AutoSaveContext from "./autoSaveContext";
import { useToggle } from "ahooks";

export interface ReplProps { }

const Repl = (props: ReplProps) => {
  const store = useStore();
  const [autoSave, { toggle: toggleAutoSave }] = useToggle(true)

  return (
    <div className="react-repl">
      <AutoSaveContext.Provider value={{ autoSave, toggleAutoSave }}>
        <StoreContext.Provider value={store}>
          <Layout>
            <EditorContainer></EditorContainer>
            <Preview></Preview>
          </Layout>
        </StoreContext.Provider>
      </AutoSaveContext.Provider>
    </div>
  );
};

export default Repl;
