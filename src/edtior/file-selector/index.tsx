import React, { EventHandler, Fragment, useContext, useRef, useState } from "react";
import StoreContext, { importMapFile } from "../../component/repl/storeContext";
import "./index.less";
const FileSelector = () => {
  const [pending, setPending] = useState<boolean | string>(false);
  const [pendingFileName, setPendingFileName] = useState<string>("Comp.tsx");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const store = useContext(StoreContext);
  const { files, activeFilename, renameFile, addFile, deleteFile, setActive } =
    store!;

  const filenames = Object.entries(files).filter(([name]) => name !== importMapFile).map(([name]) => name);
  console.log(files, filenames)
  const startAddFile = () => {
    let i = 0;
    let name = "Comp.jsx";

    while (true) {
      let hasConfict = false;

      for (const filename in files) {
        if (filename === name) {
          hasConfict = true;
          name = `Comp${++i}.jsx`;
          break;
        }
      }
      if (!hasConfict) break;
    }
    setPendingFileName(name);
    setPending(true);

    // 增加file之后自动聚焦
    setTimeout(() => inputRef.current?.focus());
  };

  const cancelNameFile = () => {
    setPending(false);
  };

  const doneNameFile = () => {
    if (!pending) return;
    if (!pendingFileName) {
      setPending(false);
      return;
    }

    const filename = pendingFileName;
    const oldFilename = pending === true ? "" : pending;

    // 前置校验名称合法性、重复性
    if (filename !== oldFilename && filename in files) {
      return;
    }

    cancelNameFile();

    if (filename === oldFilename) return;

    if (oldFilename) {
      renameFile(oldFilename, filename);
    } else {
      // 添加file
      addFile(filename);
    }
  };

  const editFileName = (file: string) => {
    setPendingFileName(file);
    setPending(file);
  };

  const handleDelete = (e: Event, file: string) => {
    e.stopPropagation()
    deleteFile(file)
  }

  return (
    <div className="file-selector">
      {filenames?.map((file, index) => (
        <Fragment key={index}>
          {pending !== file && (
            <div
              className={`file ${activeFilename === file && "active"}`}
              onClick={() => setActive(file)}
              onDoubleClick={() => index > 0 && editFileName(file)}
            >
              <span className="label">{file}</span>
              {index > 0 && (
                <span className="remove" onClick={(e) => handleDelete(e as unknown as Event, file)}>
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
          )}
          {((pending === true && index === filenames.length - 1) ||
            pending === file) && (
              <div className="file pending">
                <span className="file pending">{pendingFileName}</span>
                <input
                  ref={inputRef}
                  value={pendingFileName}
                  onChange={(e) => setPendingFileName(e.target.value)}
                  onBlur={doneNameFile}
                  onKeyUp={(e) =>
                    (e.key === "Enter" || e.key === "Esc") && doneNameFile()
                  }
                ></input>
              </div>
            )}
        </Fragment>
      ))}
      <span className="add" onClick={startAddFile}>
        +
      </span>

      <div className="import-map-wrapper">
        <div className={`file ${activeFilename === importMapFile && "active"}`} onClick={() => setActive(importMapFile)}>
          <span className="label">Import Map</span>
        </div>
      </div>
    </div>
  );
};

export default FileSelector;
