// import Editor from "@monaco-editor/react";
import { Ref, useEffect, useRef } from "react";
import * as monaco from "monaco-editor-core";
import { registerHighlighter } from "./highlight";

interface Props {
  onChange: (code: string) => void;
}

const MonacoEditor = (props: Props) => {
  const { onChange } = props;

  const containerRef = useRef(null) as unknown as Ref<HTMLDivElement>;
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
    const theme = registerHighlighter();
    console.log(theme.light);
    editorInstance.current = monaco.editor.create(containerRef.current, {
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
      theme: theme.light,
    });

    return () => {
      editorInstance.current?.dispose();
    };
  }, [monaco]);

  // Windows/Linux: Ctrl + S；Mac：Meta(⌘) + S
  const emitChangeEvent = (e: KeyboardEvent) => {
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      onChange(editorInstance.current?.getValue() || "");
      e.preventDefault();
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
      onKeyDown={emitChangeEvent}
    ></div>
  );
};

export default MonacoEditor;
