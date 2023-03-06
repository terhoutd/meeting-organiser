import NoTickSvg from "../assets/noTickSvg";
import clsx from "clsx";
import { TickBox } from "../others/Types";
export default function TickBoxNo({ variant }: TickBox) {
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
        } items-center justify-center bg-gray-50`}
      >
        <NoTickSvg className={`${isTable ? "w-7" : "w-4"} text-slate-400`} />
      </div>
      {isLegend || isLegendFull ? <div className="shrink-0 pl-1">No</div> : ""}
    </div>
  );
}
