import React, { useRef } from "react";
import Layout from "../../layout";
import Preview from "../../ouput/preview";
import EditorContainer from "../../edtior/edtior-container";
import "./index.less";
import { OutputContext } from "../../ouput/outputContext";

const Repl = () => {
  const previewRef = useRef(null);
  return (
    <div className="react-repl">
      <OutputContext.Provider value={previewRef}>
        <Layout>
          <EditorContainer></EditorContainer>
          <Preview ref={previewRef}></Preview>
        </Layout>
      </OutputContext.Provider>
    </div>
  );
};

export default Repl;
