import React, { useContext, useRef } from "react";
import { transform } from "@babel/standalone";
import { OutputContext } from "../../ouput/outputContext";

const EditorContainer = () => {
  const previewRef = useContext(OutputContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  console.log("previewRef", previewRef);
  const onClick = () => {
    const code = textareaRef.current?.value;
    // createImportMapScript()
    const res = transform(code, {
      presets: ["react", "typescript"],
      filename: "test.js",
    }).code;
    // console.log(previewRef.current);
    previewRef.current.contentWindow.postMessage(res);
  };

  const code = useRef<string>("");
  const codeStr = `import React, { useEffect, useState } from "react";
    import ReactDOM from 'react-dom/client';
  
    function App() {
      const [num, setNum] = useState(() => {
        const num1 = 1 + 2;
        const num2 = 2 + 3;
        return num1 + num2
      });
    
      return (
        "Hello World!!"
      );
    }
  
    ReactDOM.createRoot(document.getElementById('root')).render(      <App />
  )
    
    `;
  return (
    <>
      <textarea
        defaultValue={codeStr}
        ref={textareaRef}
        style={{ width: "500px", height: "300px" }}
        onChange={(e) => {
          code.current = e.target.value;
        }}
      ></textarea>
      <button onClick={onClick}>编译</button>
    </>
  );
};

export default EditorContainer;
