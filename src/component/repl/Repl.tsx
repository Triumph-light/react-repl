import React from "react";
import SplitPane from "../../split-pane/index.tsx";
import Preview from "../../ouput/preview/index.tsx";
import EditorContainer from "../../edtior/edtior-container/index.tsx";
import "./index.less";
import StoreContext, { ReturnStore, useStore } from "./storeContext";
import AutoSaveContext from "./autoSaveContext";
import { useToggle } from "ahooks";
import ThemeContext from "./themeContext.ts";
import { Theme } from "../../types.ts";

export interface ReplProps {
  /**
   * 全局数据
   */
  store?: ReturnStore,
  /**
   * 是否自动保存
   * @default true
   */
  autoSave?: boolean
  /**
   * 主题色
   * @default "light"
   */
  theme?: Theme
}

const Repl = (props: ReplProps) => {
  const { autoSave: defaultAutoSave = true, theme = 'light', store } = props;
  const [autoSave, { set: setAutoSave }] = useToggle(defaultAutoSave)

  /**
   * 未传入store，自动兜底
   */
  const innerStore = useStore()

  return (
    <div className="react-repl">
      <ThemeContext.Provider value={theme}>
        <AutoSaveContext.Provider value={{ autoSave, setAutoSave }}>
          <StoreContext.Provider value={store || innerStore}>
            <SplitPane>
              <EditorContainer></EditorContainer>
              <Preview></Preview>
            </SplitPane>
          </StoreContext.Provider>
        </AutoSaveContext.Provider></ThemeContext.Provider>
    </div>
  );
};

export default Repl;
