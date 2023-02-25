import { IFNEEDBE_TW_BG_COLOR, testcolor, YES_TW_BG_COLOR } from "../others/Constants";
import IfNeedBeSvg from "../assets/IfNeedBeSvg";
import clsx from "clsx";

export default function TickboxIfneedbe() {
  return (
    <div className={clsx("flex h-full w-full items-center justify-center", "bg-yellow-100")}>
      <IfNeedBeSvg className="w-6  text-yellow-700" />
    </div>
  );
}
//" bg-" + IFNEEDBE_TW_BG_COLOR
