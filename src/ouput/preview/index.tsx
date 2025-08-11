import { useContext, useEffect, useRef, useState } from "react";
import Message from "../../component/Message";
import StoreContext from "../../component/repl/storeContext";
import { compileModulesForPreview } from "../moduleCompiler";
import { PreviewProxy } from "../PreviewProxy";
import iframeRaw from "./iframe.html?raw";
import "./index.less";

const Preview = () => {
  const store = useContext(StoreContext);
  const importMap = store.getImportMap();

  const proxy = useRef<PreviewProxy | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sandbox = useRef<HTMLIFrameElement | null>(null);

  const [runtimeError, setRuntimeError] = useState<string>("");

  const createSandbox = () => {
    if (!containerRef.current) return;
    sandbox.current = document.createElement("iframe");
    const sandboxSrc = iframeRaw.replace(
      /<!--IMPORT_MAP-->/,
      JSON.stringify(importMap),
    );

    sandbox.current.srcdoc = sandboxSrc;
    containerRef.current.appendChild(sandbox.current);
    proxy.current = new PreviewProxy(sandbox.current, {
      on_success: (event: any) => {},
      on_error: (event: any) => {
        const msg =
          event.value instanceof Error ? event.value.message : event.value;
        if (
          msg.includes("Failed to resolve module specifier") ||
          msg.includes("Error resolving module specifier")
        ) {
          setRuntimeError(
            `${msg.replace(
              /\. Relative references must.*$/,
              "",
            )}.\nTip: edit the "Import Map" tab to specify import paths for dependencies.`,
          );
        } else {
          setRuntimeError(event.value);
        }
      },
    });

    sandbox.current.addEventListener("load", () => updatePreview());
  };

  function updatePreview() {
    console.clear();
    setRuntimeError("");

    try {
      const modules = compileModulesForPreview(store);
      const codeToEval = [
        `
        import * as React from 'react'
        window.__modules__ = {};
        window.React = React;
      `,
        ...modules,
      ];

      codeToEval.push(
        `
        import React from 'react'
        import { createRoot } from "react-dom/client";
        const App = __modules__["${store.mainFile}"].default;

        createRoot(document.getElementById("root")).render(React.createElement(App));
      `,
      );

      proxy.current!.eval(codeToEval);
    } catch (e) {
      console.error(e, "error");
      setRuntimeError((e as Error).message);
    }
  }

  useEffect(() => {
    createSandbox();
    return () => {
      containerRef.current?.removeChild(sandbox.current!);
      proxy.current?.destroy();
    };
  }, [store.version]);

  return (
    <>
      <div className="iframe-container" ref={containerRef} />
      <Message err={runtimeError}></Message>
    </>
  );
};

export default Preview;
