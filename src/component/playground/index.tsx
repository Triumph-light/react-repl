import React, { useEffect, useState } from "react";
import "./index.less";
import Header from "../header/index.tsx";
import Repl from "../repl/Repl.tsx";
import { Theme } from "../../types.ts";
import { useStore } from "../repl/storeContext.ts";
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
  return (
    <div className="playground-container">
      <Header theme={theme} onChangeTheme={(value) => setTheme(value)}></Header>
      <Repl store={store} theme={theme}></Repl>
    </div>
  );
};

export default Playground;
