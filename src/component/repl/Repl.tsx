import React, { useRef, useState } from "react";
import Layout from "../../layout";
import Preview from "../../ouput/preview";
import EditorContainer from "../../edtior/edtior-container";
import "./index.less";
import { OutputContext } from "../../ouput/outputContext";
import StoreContext, { StoreType, useStore } from "./storeContext";
import AutoSaveContext from "./autoSaveContext";
import { useToggle } from "ahooks";

const Repl = () => {
  const previewRef = useRef(null);

  const store = useStore();
  const [autoSave, { toggle: toggleAutoSave }] = useToggle(true)

  return (
    <div className="react-repl">
      <AutoSaveContext.Provider value={{ autoSave, toggleAutoSave }}>
        <StoreContext.Provider value={store}>
          <OutputContext.Provider value={previewRef}>
            <Layout>
              <EditorContainer></EditorContainer>
              <Preview ref={previewRef}></Preview>
            </Layout>
          </OutputContext.Provider>
        </StoreContext.Provider>
      </AutoSaveContext.Provider>
    </div>
  );
};

export default Repl;
