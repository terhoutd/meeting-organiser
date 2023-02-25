import YesTickSvg from "../assets/YesTickSvg";
import clsx from "clsx";
//import { YES_TW_BG_COLOR } from "../others/Constants";
export const YES_TW_BG_COLOR = "bg-lime-100";

export default function TickBoxYes() {
  return (
    <div className={`flex h-full w-full items-center justify-center ${YES_TW_BG_COLOR}`}>
      <YesTickSvg className="w-7 text-lime-700" />
    </div>
  );
}
//"text-lime-700 h-9 w-9"
