export interface ImportMap {
  imports?: Record<string, string | undefined>;
  scopes?: Record<string, Record<string, string>>
}

export function useReactImportMap() {
  const importMap = {
    "imports": {
      "react": "https://esm.sh/react@18.2.0",
      "react-dom/client": "https://esm.sh/react-dom@18.2.0"
    }
  }

  return { importMap }
}

export function mergeImportMap(
  a: ImportMap,
  b: ImportMap,
): ImportMap {
  return {
    imports: { ...a.imports, ...b.imports },
    scopes: { ...a.scopes, ...b.scopes },
  }
}