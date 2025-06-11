import React, { useEffect, useRef, useState } from "react";
import "./index.less";
import Header from "../header/index.tsx";
import Repl from "../repl/Repl.tsx";
import { Theme } from "../../types.ts";
import { useStore } from "../repl/storeContext.ts";
import { useMount } from "ahooks";

function isMobile() {
  const userAgent = navigator.userAgent;
  const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
  const isSmallScreen = window.innerWidth <= 768;
  return isMobileUA || isSmallScreen;
}

const Playground = () => {
  const [theme, setTheme] = useState<Theme>("light");

  const hash = location.hash.slice(1)

  const store = useStore({}, hash);

  const newHash = store.serialize()
  useEffect(() => {
    history.replaceState({}, '', newHash)
  }, [newHash])

  useEffect(() => {
    document.documentElement.className = theme;

    return () => {
      document.documentElement.className = "";
    }
  }, [theme])

  /**
   * mobile 模式下，改成竖向布局
   */
  const layout = useRef<"vertical" | "horizontal">()
  useMount(() => {
    if (isMobile()) layout.current = "vertical"
  })

  return (
    <div className="playground-container">
      <Header theme={theme} onChangeTheme={(value) => setTheme(value)}></Header>
      <Repl store={store} theme={theme} layout={layout.current}></Repl>
    </div>
  );
};

export default Playground;
