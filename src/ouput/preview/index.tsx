import { forwardRef, useContext, useRef } from "react";
import iframeRaw from "./iframe.html?raw";
import { onMount } from "../../hooks/onMount";
import { onUnMount } from "../../hooks/onUnMount";
import "./index.less";
import StoreContext from "../../component/repl/storeContext";
import { transform } from "@babel/standalone";

const Preview = (props, ref) => {
  const { store } = useContext(StoreContext);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sandbox = useRef<HTMLIFrameElement | null>(null);
  const createSandbox = () => {
    sandbox.current = document.createElement("iframe");
    sandbox.current.srcdoc = iframeRaw;
    containerRef.current?.appendChild(sandbox.current);
    sandbox.current.addEventListener("load", () => {
      sandbox.current?.contentWindow?.postMessage(
        transform(store.activeFile.code, {
          presets: ["react"],
        }).code,
        "*"
      );
    });
  };

  onMount(() => {
    createSandbox();
    console.log("store", store);
  });

  onUnMount(() => {
    containerRef.current?.removeChild(sandbox.current);
  });

  return <div className="iframe-container" ref={containerRef} />;
};

export default forwardRef(Preview);
