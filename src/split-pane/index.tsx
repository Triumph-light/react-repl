import React, { PropsWithChildren, useRef, useState } from "react";
import "./index.less";

const SplitPane = (props: PropsWithChildren) => {
  const { children } = props;
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<boolean>(false)

  if (!children || !Array.isArray(children)) {
    console.warn("⚠️ Layout 组件未传入 children！");
    return;
  }
  const leftNode = children[0] || null;
  const rightNode = children[1] || null;

  const [splitInfo, setSplitInfo] = useState({
    split: 50,
    viewWidth: 0,
    viewHeight: 0
  })

  const boundSplit = splitInfo.split < 20 ? 20 : splitInfo.split > 80 ? 80 : splitInfo.split;
  let startPosition = 0
  let startSplit = 0
  const dragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    startSplit = splitInfo.split
    startPosition = e.pageX
  }

  const dragMove = (e: React.MouseEvent) => {
    if (containerRef.current && dragging) {
      const totalSize = containerRef.current.clientWidth
      const split = startSplit + (e.pageX - startPosition) / totalSize * 100
      setSplitInfo({
        split,
        viewWidth: Math.floor(split * totalSize / 100),
        viewHeight: containerRef.current.clientHeight
      })
    }
  }

  const dragEnd = () => {
    setDragging(false)
  }

  return (
    <div className={`split-pane ${dragging && 'dragging'}`}
      ref={containerRef}
      onMouseMove={dragMove}
      onMouseLeave={dragEnd}
      onMouseUp={dragEnd}
    >
      <div className="left" style={{ ['width']: boundSplit + '%' }}>
        {leftNode}
        <div className="dragger" onMouseDown={dragStart}></div>
      </div>
      <div className="right" style={{ ['width']: 100 - boundSplit + '%' }}>
        <div className="view-size">{splitInfo.viewWidth}px x {splitInfo.viewHeight}px</div>
        {rightNode}</div>
    </div>
  );
};

export default SplitPane;
