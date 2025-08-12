import { useMount } from "ahooks";
import * as monaco from "monaco-editor";
import { editor, Uri } from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { useEffect } from "react";
import { getOrCreateModel, normalizeCompilerOptions } from "../utils";
import type { ReplStore } from "../component/repl/storeContext";

export function initMonaco(store: ReplStore) {
  useMount(() => {
    loadMonacoEnv(store);
  });

  useEffect(() => {
    // create a model for each file in the store
    Object.entries(store.files).forEach(([filename, file]) => {
      if (!editor.getModel(Uri.parse(`file:///${filename}`))) {
        getOrCreateModel(
          Uri.parse(`file:///${filename}`),
          file.language,
          file.code,
        );
      }
    });

    // dispose of any models that are not in the store
    for (const model of editor.getModels()) {
      const uri = model.uri.toString();
      if (store.files[uri.substring("file:///".length)]) continue;

      if (uri.startsWith("file:///node_modules")) continue;
      if (uri.startsWith("inmemory://")) continue;

      model.dispose();
    }
  });
}

export function loadMonacoEnv(store: ReplStore) {
  self.MonacoEnvironment = {
    getWorker(_: any, label: string) {
      switch (label) {
        case "json":
          return new jsonWorker();
        case "css":
        case "scss":
        case "less":
          return new cssWorker();
        case "typescript":
        case "javascript":
          return new tsWorker();
        default:
          return new editorWorker();
      }
    },
  };

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    jsx: monaco.languages.typescript.JsxEmit.React,
    allowJs: true,
    checkJs: true,
    allowNonTsExtensions: true,
  });

  /**
   * 根据tsconfig.json设置monaco的tsworker配置
   */
  const tsconfig = store.getTsConig();
  console.log("tsconfig", normalizeCompilerOptions(tsconfig.compilerOptions));
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...normalizeCompilerOptions(tsconfig.compilerOptions),
  });

  // 添加默认 lib（重要，否则编辑器不知道 DOM 类型等）
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

  // 假设你用 fetch 从 CDN 获取 React 类型声明
  /**
   * todo: 做一个版本选择
   */
  async function addReactTypes() {
    const reactDts = await fetch(
      "https://cdn.jsdelivr.net/npm/@types/react@18/index.d.ts",
    ).then((res) => res.text());

    const reactDomDts = await fetch(
      "https://cdn.jsdelivr.net/npm/@types/react-dom@18/index.d.ts",
    ).then((res) => res.text());

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactDts,
      "file:///node_modules/@types/react/index.d.ts",
    );
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactDomDts,
      "file:///node_modules/@types/react-dom/index.d.ts",
    );
  }

  addReactTypes();
}
