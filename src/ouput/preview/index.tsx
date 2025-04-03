import { forwardRef } from "react";
import iframeRaw from "./iframe.html?raw";

const iframeUrl = URL.createObjectURL(
  new Blob([iframeRaw], { type: "text/html" })
);

const Preview = (props, ref) => {
  return (
    <iframe
      ref={ref}
      src={iframeUrl}
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
};

export default forwardRef(Preview);
