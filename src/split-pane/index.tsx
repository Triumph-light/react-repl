import React, { PropsWithChildren, useRef, useState } from "react";
import "./index.less";

const SplitPane = (props: PropsWithChildren) => {
  const { children } = props;
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<boolean>(false)

  const [splitInfo, setSplitInfo] = useState({
    split: 50,
  })

  if (!children || !Array.isArray(children)) {
    console.warn("⚠️ Layout 组件未传入 children！");
    return;
  }
  const leftNode = children[0] || null;
  const rightNode = children[1] || null;

  const totalSize = containerRef.current?.clientWidth || 0
  const boundSplit = splitInfo.split < 20 ? 20 : splitInfo.split > 80 ? 80 : splitInfo.split;
  const viewWidth = Math.floor(boundSplit * totalSize / 100)
  const viewHeight = containerRef.current?.clientHeight || 0

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
      const split = startSplit + (e.pageX - startPosition) / totalSize * 100
      setSplitInfo({
        split,
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
        {dragging && <div className="view-size" >{viewWidth}px x {viewHeight}px</div>}
        {rightNode}</div>
    </div>
  );
};

export default SplitPane;
