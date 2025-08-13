import { useMount } from "ahooks";
import * as monaco from "monaco-editor";
import { editor, Uri } from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { useEffect } from "react";
import {
  getOrCreateModel,
  normalizeCompilerOptions,
  registerDtsRecursive,
} from "../utils";
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
  console.log("load");
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
   * 设置compilerOptions，并注册dts文件
   */
  const tsconfig = store.getTsConig();
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...normalizeCompilerOptions(tsconfig.compilerOptions),
  });
  // todo: 内部先默认支持react类型，后续进行统一处理
  registerDtsRecursive(
    "https://cdn.jsdelivr.net/npm/@types/react@18/index.d.ts",
  );
  registerDtsRecursive(
    "https://cdn.jsdelivr.net/npm/@types/react-dom@18/index.d.ts",
  );
  tsconfig.compilerOptions?.types?.forEach((entryUrl: string) => {
    registerDtsRecursive(entryUrl);
  });

  // 添加默认 lib（重要，否则编辑器不知道 DOM 类型等）
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
}
