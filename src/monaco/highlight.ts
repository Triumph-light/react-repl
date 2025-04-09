import * as monaco from 'monaco-editor-core'
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki'
import { shikiToMonaco } from '@shikijs/monaco'

import langTsx from 'shiki/langs/tsx.mjs'
import langJsx from 'shiki/langs/jsx.mjs'
import themeDark from 'shiki/themes/dark-plus.mjs'
import themeLight from 'shiki/themes/light-plus.mjs'

export function registerHighlighter() {
    const highlighter = createHighlighterCoreSync({
        themes: [themeDark, themeLight],
        langs: [langTsx, langJsx],
        engine: createJavaScriptRegexEngine(),
    })
    monaco.languages.register({ id: 'jsx', extensions: ['.jsx'] })
    monaco.languages.register({ id: 'tsx', extensions: ['.tsx'] })
    shikiToMonaco(highlighter, monaco)

    return {
        light: themeLight.name!,
        dark: themeDark.name!,
    }
}


