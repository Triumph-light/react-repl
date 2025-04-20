import { forwardRef, useContext, useRef } from "react";
import iframeRaw from "./iframe.html?raw";
import { onMount, onUnMount } from "../../hooks/index";
import "./index.less";
import StoreContext from "../../component/repl/storeContext";
import { transform } from "@babel/standalone";
import { PreviewProxy } from "../PreviewProxy";
import { compileModulesForPreview } from "../moduleCompiler";

const Preview = () => {
  const store = useContext(StoreContext);
  const proxy = useRef<PreviewProxy | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sandbox = useRef<HTMLIFrameElement | null>(null);
  const createSandbox = () => {
    sandbox.current = document.createElement("iframe");
    sandbox.current.srcdoc = iframeRaw;
    containerRef.current?.appendChild(sandbox.current);
    proxy.current = new PreviewProxy(sandbox.current);
    sandbox.current.addEventListener("load", () => {
      updatePreview();
    });
  };

  function updatePreview() {
    const modules = compileModulesForPreview(store);

    const codeToEval = [`window.__modules__ = {}`, ...modules];

    codeToEval.push(
      `
        import { createRoot } from "react-dom/client";
        import "./index.css";
        const App = __modules__["App.jsx"]

        createRoot(document.getElementById("root")).render(<App />);
      `
    );

    proxy.current!.eval(codeToEval);
  }

  onMount(() => {
    createSandbox();
    console.log("preview", store);
  });

  onUnMount(() => {
    containerRef.current?.removeChild(sandbox.current!);
  });

  return <div className="iframe-container" ref={containerRef} />;
};

export default forwardRef(Preview);
