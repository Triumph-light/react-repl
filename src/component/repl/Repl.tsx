import React, { useRef, useState } from "react";
import Layout from "../../layout";
import Preview from "../../ouput/preview";
import EditorContainer from "../../edtior/edtior-container";
import "./index.less";
import { OutputContext } from "../../ouput/outputContext";
import StoreContext, { StoreType, useStore } from "./storeContext";

const Repl = () => {
  const previewRef = useRef(null);

  const store = useStore();
  console.log("store", store);

  return (
    <div className="react-repl">
      <StoreContext.Provider value={store}>
        <OutputContext.Provider value={previewRef}>
          <Layout>
            <EditorContainer></EditorContainer>
            <Preview ref={previewRef}></Preview>
          </Layout>
        </OutputContext.Provider>
      </StoreContext.Provider>
    </div>
  );
};

export default Repl;
