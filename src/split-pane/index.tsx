import React, { PropsWithChildren, useRef, useState } from "react";
import "./index.less";

interface SplitPaneProps {
  layout?: 'horizontal' | 'vertical'
}

const SplitPane = (props: PropsWithChildren<SplitPaneProps>) => {
  const { children, layout } = props;
  const isVertical = layout === 'vertical'
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

  const boundSplit = splitInfo.split < 20 ? 20 : splitInfo.split > 80 ? 80 : splitInfo.split;
  let totalSize: number, viewHeight: number, viewWidth: number
  if (isVertical) {
    totalSize = containerRef.current?.clientHeight || 0
    viewWidth = containerRef.current?.clientWidth || 0
    viewHeight = Math.floor(boundSplit * totalSize / 100)
  } else {
    totalSize = containerRef.current?.clientWidth || 0
    viewWidth = Math.floor(boundSplit * totalSize / 100)
    viewHeight = containerRef.current?.clientHeight || 0
  }

  let startPosition = 0
  let startSplit = 0
  const dragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    startSplit = splitInfo.split
    startPosition = isVertical ? e.pageY : e.pageX
  }

  const dragMove = (e: React.MouseEvent) => {
    if (containerRef.current && dragging) {
      const moveEnd = isVertical ? e.pageY : e.pageX
      const split = startSplit + (moveEnd - startPosition) / totalSize * 100
      setSplitInfo({
        split,
      })
    }
  }

  const dragEnd = () => {
    setDragging(false)
  }

  return (
    <div className={`split-pane ${dragging && 'dragging'} ${isVertical && 'vertical'}`}
      ref={containerRef}
      onMouseMove={dragMove}
      onMouseLeave={dragEnd}
      onMouseUp={dragEnd}
    >
      <div className="left" style={{ [!isVertical ? 'width' : 'height']: boundSplit + '%' }}>
        {leftNode}
        <div className="dragger" onMouseDown={dragStart}></div>
      </div>
      <div className="right" style={{ [!isVertical ? 'width' : 'height']: 100 - boundSplit + '%' }}>
        {dragging && <div className="view-size" >{viewWidth}px x {viewHeight}px</div>}
        {rightNode}</div>
    </div>
  );
};

export default SplitPane;
