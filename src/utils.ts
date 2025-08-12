import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";
import * as monaco from "monaco-editor";

import { editor, type Uri } from "monaco-editor";

export function utoa(data: string): string {
  const buffer = strToU8(data);
  const zipped = zlibSync(buffer, { level: 9 });
  const binary = strFromU8(zipped, true);
  return btoa(binary);
}

export function atou(base64: string): string {
  const binary = atob(base64);

  // zlib header (x78), level 9 (xDA)
  if (binary.startsWith("\x78\xDA")) {
    const buffer = strToU8(binary, true);
    const unzipped = unzlibSync(buffer);
    return strFromU8(unzipped);
  }

  // old unicode hacks for backward compatibility
  // https://base64.guru/developers/javascript/examples/unicode-strings
  return decodeURIComponent(escape(binary));
}

// 枚举映射表
const enumMap = {
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind,
  module: monaco.languages.typescript.ModuleKind,
  jsx: monaco.languages.typescript.JsxEmit,
  target: monaco.languages.typescript.ScriptTarget,
};
type enumMapKey = keyof typeof enumMap;
/**
 * 将 tsconfig.compilerOptions 中的字符串枚举转成 Monaco 可识别的枚举值
 */
export function normalizeCompilerOptions(options: Record<string, any>) {
  if (!options || typeof options !== "object") return {};

  const normalized = { ...options };

  Object.keys(enumMap).forEach((key) => {
    if (normalized[key] == null) return;

    const enumObj = enumMap[key as enumMapKey];
    const val = normalized[key];

    if (typeof val === "string") {
      normalized[key] = enumObj[val as any];
    }
  });

  return normalized;
}

export function getOrCreateModel(
  uri: Uri,
  lang: string | undefined,
  value: string,
) {
  const model = editor.getModel(uri);
  if (model) {
    model.setValue(value);
    return model;
  }
  return editor.createModel(value, lang, uri);
}
