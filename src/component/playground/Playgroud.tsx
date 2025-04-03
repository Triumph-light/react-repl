import React from "react";
import "./index.less";
import Header from "../header";
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
