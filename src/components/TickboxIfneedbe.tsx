import { IFNEEDBE_TW_BG_COLOR, testcolor, YES_TW_BG_COLOR } from "../others/Constants";
import IfNeedBeSvg from "../assets/IfNeedBeSvg";
import clsx from "clsx";
import { TickBox } from "../others/Types";

export default function TickboxIfneedbe({ variant }: TickBox) {
  const isTable = variant == "table";
  const isSlotDetails = variant == "slot-details";
  const isLegend = variant == "legend";
  const isLegendFull = variant == "legend-full";
  return (
    <div
      className={`${isLegendFull ? "text-sm" : ""} flex ${
        isTable || isSlotDetails ? "h-full w-full" : ""
      } items-center`}
    >
      <div
        className={`flex ${
          isLegend || isLegendFull ? "h-7 w-7 shrink-0" : "h-full w-full"
        } items-center justify-center bg-yellow-100`}
      >
        <IfNeedBeSvg className={`${isTable ? "w-6" : "w-4"}  text-yellow-700`} />
      </div>
      {isLegend || isLegendFull ? (
        <div className="shrink-0 pl-1">If need be {isLegendFull ? "(2 clicks)" : ""}</div>
      ) : (
        ""
      )}
    </div>
  );
}
//" bg-" + IFNEEDBE_TW_BG_COLOR
