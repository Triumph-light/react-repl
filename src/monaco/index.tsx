import { KeyboardEvent, useContext, useEffect, useRef } from "react";
import * as monaco from "monaco-editor-core";
import { registerHighlighter } from "./highlight";
import AutoSaveContext from "../component/repl/autoSaveContext";
import { useMount, useUnmount, useUpdateEffect } from "ahooks";
import ThemeContext from "../component/repl/themeContext";

interface Props {
  onChange: (code: string) => void;
  value: string;
}

const MonacoEditor = (props: Props) => {
  const { onChange, value } = props;
  const propTheme = useContext(ThemeContext)

  const emitChangeEvent = () => {
    onChange(editorInstance.current?.getValue() || "");
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>(null);

  const theme = useRef<Record<string, string>>(null)
  const initMonacoEditor = () => {
    theme.current = registerHighlighter();
    if (containerRef.current) {
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
        // theme: theme['light']
        theme: theme.current[propTheme]
      })
    }
  }

  useMount(() => {
    initMonacoEditor()
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

  /**
   * theme toggle
   */
  useUpdateEffect(() => {
    monaco.editor.setTheme(theme.current![propTheme])
  }, [propTheme])

  /**
   * value change
   */
  useUpdateEffect(() => {
    if (editorInstance.current && value !== editorInstance.current.getValue())
      editorInstance.current.setValue(value)
  }, [value])

  useUnmount(() => {
    editorInstance.current?.dispose();
  })

  // Windows/Linux: Ctrl + S；Mac：Meta(⌘) + S
  const handleChange = (event: KeyboardEvent) => {
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
