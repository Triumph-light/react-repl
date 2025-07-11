import { KeyboardEvent, useContext, useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { registerHighlighter } from "./highlight";
import AutoSaveContext from "../component/repl/autoSaveContext";
import { useMount, useUnmount, useUpdateEffect } from "ahooks";
import ThemeContext from "../component/repl/themeContext";
import { initMonaco } from "./env";

interface Props {
  onChange: (code: string) => void;
  value: string;
  language?: string;
}

const MonacoEditor = (props: Props) => {
  const { onChange, value, language } = props;
  const propTheme = useContext(ThemeContext)!

  const emitChangeEvent = () => {
    if (!__prevent_trigger_change_event.current) {
      onChange(editorInstance.current?.getValue() || "");
    }
  }
  initMonaco()
  const containerRef = useRef<HTMLDivElement>(null)
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>(null);

  const theme = useRef<Record<string, string>>(null)
  const initMonacoEditor = () => {
    theme.current = registerHighlighter();
    if (containerRef.current) {
      editorInstance.current = monaco.editor.create(containerRef.current, {
        value: value,
        language,
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
        theme: theme.current[propTheme],
      })
    }
  }

  useMount(() => {
    initMonacoEditor()
  })

  /** 
  * autosave
  */
  const { autoSave } = useContext(AutoSaveContext)!;
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
  const __prevent_trigger_change_event = useRef<boolean | null>(null);
  useUpdateEffect(() => {
    if (editorInstance.current) {
      if (value === editorInstance.current.getValue()) {
        return;
      }

      const model = editorInstance.current.getModel();
      __prevent_trigger_change_event.current = true;
      editorInstance.current.pushUndoStop();
      // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
      model!.pushEditOperations(
        [],
        [
          {
            range: model!.getFullModelRange(),
            text: value,
          },
        ],
        undefined,
      );
      editorInstance.current.pushUndoStop();
      __prevent_trigger_change_event.current = false;
    }
  }, [value])

  /**
   * language change
   */
  useUpdateEffect(() => {
    if (editorInstance.current) {
      const model = editorInstance.current.getModel();
      monaco.editor.setModelLanguage(model!, language!);
    }
  }, [language]);

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
