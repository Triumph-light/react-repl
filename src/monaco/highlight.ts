import { shikiToMonaco } from "@shikijs/monaco";
import * as monaco from "monaco-editor";
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from "shiki";

import langJsx from "shiki/langs/jsx.mjs";
import langTsx from "shiki/langs/tsx.mjs";
import themeDark from "shiki/themes/dark-plus.mjs";
import themeLight from "shiki/themes/light-plus.mjs";

export function registerHighlighter() {
  const highlighter = createHighlighterCoreSync({
    themes: [themeDark, themeLight],
    langs: [langTsx, langJsx],
    engine: createJavaScriptRegexEngine(),
  });
  monaco.languages.register({ id: "javascript", extensions: [".jsx", ".js"] });
  monaco.languages.register({ id: "typescript", extensions: [".tsx", ".ts"] });
  shikiToMonaco(highlighter, monaco);

  return {
    light: themeLight.name!,
    dark: themeDark.name!,
  };
}
