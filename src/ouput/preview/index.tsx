import { useContext, useRef } from "react";
import iframeRaw from "./iframe.html?raw";
import { onMount, onUnMount } from "../../hooks/index";
import "./index.less";
import StoreContext, { importMapFile } from "../../component/repl/storeContext";
import { PreviewProxy } from "../PreviewProxy";
import { compileModulesForPreview } from "../moduleCompiler";

const Preview = () => {
  const store = useContext(StoreContext);
  const importMap = JSON.parse(store.files[importMapFile]?.code || '{}')

  const proxy = useRef<PreviewProxy | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sandbox = useRef<HTMLIFrameElement | null>(null);
  const createSandbox = () => {
    sandbox.current = document.createElement("iframe");
    const sandboxSrc = iframeRaw.replace(/<!--IMPORT_MAP-->/, JSON.stringify(importMap))

    sandbox.current.srcdoc = sandboxSrc;
    containerRef.current?.appendChild(sandbox.current);
    proxy.current = new PreviewProxy(sandbox.current);
    sandbox.current.addEventListener("load", () => {
      updatePreview();
    });
  };

  function updatePreview() {
    const modules = compileModulesForPreview(store);

    const codeToEval = [`window.__modules__ = {}`, ...modules];

    /**
     * todo： <App/>和App（）的区别，如何导致的这种差异?
     */
    codeToEval.push(
      `
        import { createRoot } from "react-dom/client";
        const App = __modules__["App.jsx"].default;

        createRoot(document.getElementById("root")).render(App());
      `
    );

    proxy.current!.eval(codeToEval);
  }

  onMount(() => {
    createSandbox();
  });

  onUnMount(() => {
    containerRef.current?.removeChild(sandbox.current!);
  });

  return <div className="iframe-container" ref={containerRef} />;
};

export default Preview;
