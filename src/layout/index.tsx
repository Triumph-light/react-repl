import React, { PropsWithChildren } from "react";
import "./index.less";

const Layout = (props: PropsWithChildren) => {
  const { children } = props;

  if (!children || !Array.isArray(children)) {
    console.warn("⚠️ Layout 组件未传入 children！");
    return;
  }
  const leftNode = children[0] || null;
  const rightNode = children[1] || null;

  return (
    <div className="container">
      <div className="left">{leftNode}</div>
      <div className="right">{rightNode}</div>
    </div>
  );
};

export default Layout;
