import { forwardRef, useContext, useRef } from "react";
import iframeRaw from "./iframe.html?raw";
import { onMount } from "../../hooks/onMount";
import { onUnMount } from "../../hooks/onUnMount";
import "./index.less";
import StoreContext from "../../component/repl/storeContext";
import { transform } from "@babel/standalone";

const Preview = () => {
  const store = useContext(StoreContext);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sandbox = useRef<HTMLIFrameElement | null>(null);
  const createSandbox = () => {
    sandbox.current = document.createElement("iframe");
    sandbox.current.srcdoc = iframeRaw;
    containerRef.current?.appendChild(sandbox.current);

    let code = store.activeFile.code;
    if (code) {
      if (store.activeFilename === "App.jsx") {
        code = `import { createRoot } from "react-dom/client";
          ${code};
          createRoot(document.getElementById("root")).render(<App />);
        `;
      }
    }

    sandbox.current.addEventListener("load", () => {
      sandbox.current?.contentWindow?.postMessage(
        transform(code, {
          presets: ["react"],
        }).code,
        "*"
      );
    });
  };

  onMount(() => {
    createSandbox();
    console.log("preview", store);
  });

  onUnMount(() => {
    containerRef.current?.removeChild(sandbox.current);
  });

  return <div className="iframe-container" ref={containerRef} />;
};

export default forwardRef(Preview);
