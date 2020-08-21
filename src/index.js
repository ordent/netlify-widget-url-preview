import Control from "./Control";
import Preview from "./Preview";

if (typeof window !== "undefined") {
  window.URLControl = Control;
  window.URLPreview = Preview;
}

export { Control, Preview };
