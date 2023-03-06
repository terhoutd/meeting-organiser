import YesTickSvg from "../assets/YesTickSvg";
import clsx from "clsx";
import SlotDetails from "./SlotDetails";
import { TickBox } from "../others/Types";
//import { YES_TW_BG_COLOR } from "../others/Constants";
export const YES_TW_BG_COLOR = "bg-lime-100";

export default function TickBoxYes({ variant }: TickBox) {
  const isTable = variant == "table";
  const isSlotDetails = variant == "slot-details";
  const isLegend = variant == "legend";
  const isLegendFull = variant == "legend-full";

  return (
    <div
      className={`${isLegendFull ? "text-sm" : ""} flex ${
        isTable || isSlotDetails ? "h-full w-full" : ""
      } items-center ${isTable ? "mx-[5px] shrink-0 basis-[80px]" : ""}`}
    >
      <div
        className={`flex ${
          isLegend || isLegendFull ? "h-7 w-7 shrink-0" : "h-full w-full"
        } items-center justify-center ${YES_TW_BG_COLOR}`}
      >
        <YesTickSvg className={`${isTable ? "w-7" : "w-4"} text-lime-700`} />
      </div>
      {isLegend || isLegendFull ? <div className="shrink-0 pl-1">Yes {isLegendFull ? "(1 click)" : ""}</div> : ""}
    </div>
  );
}
//"text-lime-700 h-9 w-9"
