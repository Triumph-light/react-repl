import { useMount, useUnmount, useUpdateEffect } from "ahooks";
import * as monaco from "monaco-editor";
import { Uri } from "monaco-editor";
import { useContext, useEffect, useRef, type KeyboardEvent } from "react";
import AutoSaveContext from "../component/repl/autoSaveContext";
import StoreContext from "../component/repl/storeContext";
import ThemeContext from "../component/repl/themeContext";
import { initMonaco, loadMonacoEnv } from "./env";
import { registerHighlighter } from "./highlight";
import type * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

interface Props {
  onChange: (code: string) => void;
  value: string;
  language: string;
  uri?: (monaco: typeof monacoEditor) => monacoEditor.Uri;
}

const MonacoEditor = (props: Props) => {
  const { onChange, value, language } = props;
  const propTheme = useContext(ThemeContext)!;
  const store = useContext(StoreContext);
  const { activeFilename } = store;

  const emitChangeEvent = () => {
    if (!__prevent_trigger_change_event.current) {
      onChange(editorInstance.current?.getValue() || "");
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const theme = useRef<Record<string, string>>(null);
  const initMonacoEditor = () => {
    theme.current = registerHighlighter();
    if (containerRef.current) {
      editorInstance.current = monaco.editor.create(containerRef.current, {
        model: monaco.editor.getModel(Uri.parse(`file:///${activeFilename}`)),
        fontSize: 13,
        tabSize: 2,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
        inlineSuggest: {
          enabled: true,
        },
        fixedOverflowWidgets: true,
        readOnly: false,
        theme: theme.current[propTheme],
      });
      console.log(editorInstance.current.getModel()?.getLanguageId());
    }
  };

  /**
   * 初始化
   */
  initMonaco(store);
  useMount(() => {
    initMonacoEditor();
  });

  /**
   * tsconfig.json change
   */
  useUpdateEffect(() => {
    loadMonacoEnv(store);
    editorInstance.current?.setModel(
      monaco.editor.getModel(Uri.parse(`file:///${activeFilename}`)),
    );
  }, [store.getTsConig()]);

  /**
   * autosave
   */
  const { autoSave } = useContext(AutoSaveContext)!;
  useEffect(() => {
    let dispose: monaco.IDisposable | undefined;
    if (autoSave) {
      dispose =
        editorInstance.current?.onDidChangeModelContent(emitChangeEvent);
    }
    return () => {
      dispose?.dispose();
    };
  }, [autoSave]);

  /**
   * theme toggle
   */
  useUpdateEffect(() => {
    monaco.editor.setTheme(theme.current![propTheme]);
  }, [propTheme]);

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
  }, [value]);

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
  });

  // Windows/Linux: Ctrl + S；Mac：Meta(⌘) + S
  const handleChange = (event: KeyboardEvent) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      emitChangeEvent();
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
