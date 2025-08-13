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

/**
 * 提取cdn里.d.ts关键路径
 * @param url
 * @returns
 */
export function getCdnPath(url: string) {
  let path = url;

  if (url.includes("cdn.jsdelivr.net")) {
    // 去掉前缀 https://cdn.jsdelivr.net/npm/
    path = url.replace("https://cdn.jsdelivr.net/npm/", "/");
  } else if (url.includes("unpkg.com")) {
    // 去掉前缀 https://unpkg.com/
    path = url.replace("https://unpkg.com/", "/");
  } else if (url.includes("esm.sh")) {
    path = url.replace("https://esm.sh/", "/");
  } else if (url.includes("cdn.skypack.dev")) {
    path = url.replace("https://cdn.skypack.dev/", "/");
  }

  // 去掉版本号，例如 zustand@5.0.7 -> zustand
  const versionRegex = /@(\d+(\.)?)+(?:-[^\/]+)?/;
  path = path.replace(versionRegex, "");

  return path;
}

/**
 * 自动递归加载 d.ts 并注册到 Monaco
 * @param entryUrl 入口 d.ts URL
 * @param entryFile 入口文件在 Monaco 的路径（如 file:///node_modules/zustand/index.d.ts）
 */
export async function registerDtsRecursive(entryUrl: string) {
  const visited = new Map<string, string>();

  /**
   * 提取 文件路径
   */
  const entryFile = `file:///node_modules${getCdnPath(entryUrl)}`;
  async function load(url: string) {
    if (visited.has(url)) return visited.get(url)!;
    const content = await fetch(url).then((r) => r.text());
    visited.set(url, content);

    const importRegex =
      /export\s+\*\s+from\s+['"]([^'"]+)['"]|import\s+type\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(content))) {
      const depModule = match[1] || match[2];
      if (!depModule) continue;

      // 生成子模块 URL
      let depUrl = depModule;
      if (!depModule.startsWith(".")) {
        // npm 包或模块，尝试用入口 URL 替换文件名
        const parts = entryUrl.split("/");
        const base = parts.slice(0, parts.length - 1).join("/");
        const name = depModule.split("/").pop()!;
        depUrl = `${base}/${name}.d.ts`;
      } else {
        // 相对路径
        const entryParts = entryUrl.split("/");
        entryParts.pop();
        depUrl = `${entryParts.join("/")}/${depModule.replace(
          /^\.\//,
          "",
        )}.d.ts`;
      }

      await load(depUrl);
    }

    return content;
  }

  await load(entryUrl);
  // 注册所有子模块
  visited.forEach((content, url) => {
    if (url === entryUrl) return;

    const parts = url.split("/");
    const filename = parts[parts.length - 1].replace(".d.ts", "");
    const pkgName = (parts[parts.length - 2] || "lib").split("@")[0]; // 上一级目录名当包名

    const filePath = `file:///node_modules/${pkgName}/${filename}.d.ts`;
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      content,
      filePath,
    );
  });

  // 注册入口文件
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    visited.get(entryUrl)!,
    entryFile,
  );
}
