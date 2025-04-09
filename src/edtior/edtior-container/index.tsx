import React, { useContext, useRef } from "react";
import { transform } from "@babel/standalone";
import { OutputContext } from "../../ouput/outputContext";
import MonaceEditor from "../../monaco/index";

const EditorContainer = () => {
  const previewRef = useContext(OutputContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  console.log("previewRef", previewRef);

  const onChange = (code: string) => {
    console.log("code", code);
  };

  return (
    <>
      <MonaceEditor onChange={onChange}></MonaceEditor>
    </>
  );
};

export default EditorContainer;
