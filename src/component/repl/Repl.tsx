import React from "react";
import Layout from "../../layout";
import Preview from "../../ouput/preview/index.tsx";
import EditorContainer from "../../edtior/edtior-container/index.tsx";
import "./index.less";
import StoreContext, { useStore } from "./storeContext";
import AutoSaveContext from "./autoSaveContext";
import { useToggle } from "ahooks";
import ThemeContext from "./themeContext.ts";
import { Theme } from "../../types.ts";

export interface ReplProps {
  /**
   * 是否自动保存
   * @default true
   */
  autoSave?: boolean
  /**
   * 主题色
   * @default "light"
   */
  theme: Theme
}

const Repl = (props: ReplProps) => {
  const { autoSave: defaultAutoSave = true, theme = 'light' } = props;
  const store = useStore();
  const [autoSave, { set: setAutoSave }] = useToggle(defaultAutoSave)

  return (
    <div className="react-repl">
      <ThemeContext.Provider value={theme}>
        <AutoSaveContext.Provider value={{ autoSave, setAutoSave }}>
          <StoreContext.Provider value={store}>
            <Layout>
              <EditorContainer></EditorContainer>
              <Preview></Preview>
            </Layout>
          </StoreContext.Provider>
        </AutoSaveContext.Provider></ThemeContext.Provider>
    </div>
  );
};

export default Repl;
