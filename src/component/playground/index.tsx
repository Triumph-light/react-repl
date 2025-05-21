import React from "react";
import "./index.less";
import Header from "../Header/index.tsx";
import Repl from "../repl/Repl";

const Playground = () => {
  return (
    <div className="playground-container">
      <Header></Header>
      <Repl></Repl>
    </div>
  );
};

export default Playground;
