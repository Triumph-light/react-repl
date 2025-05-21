import React from "react";
import "./index.less";
import Header from "../header/index.tsx";
import Repl from "../repl/Repl.tsx";

const Playground = () => {
  return (
    <div className="playground-container">
      <Header></Header>
      <Repl></Repl>
    </div>
  );
};

export default Playground;
