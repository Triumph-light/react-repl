import React, { useRef, useState } from "react";
import Layout from "../../layout";
import Preview from "../../ouput/preview";
import EditorContainer from "../../edtior/edtior-container";
import "./index.less";
import { OutputContext } from "../../ouput/outputContext";
import StoreContext, { StoreType } from "./storeContext";

const Repl = () => {
  const previewRef = useRef(null);

  const [store, setStore] = useState<StoreType>();
  return (
    <div className="react-repl">
      <StoreContext.Provider value={{ store, setStore }}>
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
