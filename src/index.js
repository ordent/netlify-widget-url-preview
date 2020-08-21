import Control from "./Control";
import Preview from "./Preview";

if (typeof window !== "undefined") {
  window.URLControl = URLControl;
  window.URLPreview = URLPreview;
}

export { Control as URLControl, Preview as URLPreview };
