// import Editor from "@monaco-editor/react";
import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import * as monaco from "monaco-editor-core";
import { registerHighlighter } from "./highlight";
import AutoSaveContext from "../component/repl/autoSaveContext";
import { useMount, useUnmount } from "ahooks";
import ThemeContext from "../component/repl/themeContext";

interface Props {
  onChange: (code: string) => void;
  value: string;
}

const MonacoEditor = (props: Props) => {
  const { onChange, value } = props;
  const propsTheme = useContext(ThemeContext)

  const emitChangeEvent = () => {
    onChange(editorInstance.current?.getValue() || "");
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>(null);

  useMount(() => {
    const theme = registerHighlighter();
    editorInstance.current = monaco.editor.create(containerRef.current, {
      value: value,
      language: "jsx",
      fontSize: 13,
      tabSize: 2,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      minimap: {
        enabled: false,
      },
      inlineSuggest: {
        enabled: false,
      },
      fixedOverflowWidgets: true,
      readOnly: false,
      theme: propsTheme === 'light' ? theme.light : theme.dark,
    })
  })

  /** 
  * autosave
  */
  const { autoSave } = useContext(AutoSaveContext);
  useEffect(() => {
    let dispose: monaco.IDisposable | undefined;
    if (autoSave) {
      dispose = editorInstance.current?.onDidChangeModelContent(emitChangeEvent)
    }
    return () => {
      dispose?.dispose();
    }
  }, [autoSave])

  useUnmount(() => {
    editorInstance.current?.dispose();
  })

  // Windows/Linux: Ctrl + S；Mac：Meta(⌘) + S
  const handleChange = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      emitChangeEvent()
      event.preventDefault();
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
      onKeyDown={handleChange}
    ></div>
  );
};

export default MonacoEditor;
