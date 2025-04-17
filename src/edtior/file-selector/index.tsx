import React, { useRef, useState } from "react";
import { File } from "../../component/repl/storeContext";
import "./index.less";
const FileSelector = () => {
  const pending = useRef(false);
  const [pendingFileName, setPendingFileName] = useState<string>("Comp.tsx");

  const [files, setFiles] = React.useState<File[]>([
    {
      filename: "main.tsx",
      code: "",
      language: "typescript",
    },
    {
      filename: "App.tsx",
      code: "",
      language: "typescript",
    },
  ]);

  const activeIndex = 0;

  return (
    <div className="file-selector">
      {files?.map((file, index) => (
        <>
          <div className={`file ${activeIndex === index && "active"}`}>
            <span className="label">{file.filename}</span>
            {index > 0 && (
              <span className="remove">
                <svg
                  className="icon"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                >
                  <line stroke="#999" x1="18" y1="6" x2="6" y2="18" />
                  <line stroke="#999" x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </span>
            )}
          </div>
          {pending.current && index === files.length - 1 && (
            <div className="file pending">
              {/* <span className="file pending">{pendingFileName}</span> */}
              <input value={pendingFileName}></input>
            </div>
          )}
        </>
      ))}
      <span className="add">+</span>
    </div>
  );
};

export default FileSelector;
