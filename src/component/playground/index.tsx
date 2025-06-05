import React, { useEffect, useState } from "react";
import "./index.less";
import Header from "../header/index.tsx";
import Repl from "../repl/Repl.tsx";
import { Theme } from "../../types.ts";

const Playground = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    document.documentElement.className = theme;

    return () => {
      document.documentElement.className = "";
    }
  }, [theme])
  return (
    <div className="playground-container">
      <Header theme={theme} onChangeTheme={(value) => setTheme(value)}></Header>
      <Repl theme={theme}></Repl>
    </div>
  );
};

export default Playground;
