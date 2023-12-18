import YesTickSvg from "../assets/YesTickSvg";
import clsx from "clsx";
import SlotDetails from "./SlotDetails";
import IfNeedBeSvg from "../assets/IfNeedBeSvg";
import NoTickSvg from "../assets/noTickSvg";
import QuestionSvg from "../assets/QuestionSvg";
import ClockSvg from "../assets/ClockSvg";
import PendingSvg from "../assets/PendingSvg";
import YesThinTick from "../assets/YesThinTick";
import NoThinTickSvg from "../assets/NoThinTickSvg";
//import { YES_TW_BG_COLOR } from "../others/Constants";
export const YES_TW_BG_COLOR = "bg-lime-100";
export type TickBoxType = { variant: "table" | "slot-details" | "legend" | "legend-full"; type: string };

export default function TickBox({ type, variant }: TickBoxType) {
  const isTable = variant == "table";
  const isSlotDetails = variant == "slot-details";
  const isLegend = variant == "legend";
  const isLegendFull = variant == "legend-full";

  const isYes = type == "yes";
  const isYesThin = type == "yes thin";
  const isNo = type == "no";
  const isNoThin = type == "no thin";
  const isIfneedbe = type == "if need be";
  const isQuestion = type == "question";
  const isPending = type == "pending";

  let legendText;
  if (type == "yes" || type == "yes thin") {
    legendText = `yes ${isLegendFull ? "(1 click)" : ""}`;
  }
  if (type == "no" || type == "no thin") {
    legendText = `cannot attend`;
  }
  if (type == "if need be") {
    legendText = `if need be ${isLegendFull ? "(2 clicks)" : ""}`;
  }
  if (type == "pending") {
    legendText = `pending ${isLegendFull ? "(yet to vote)" : ""}`;
  }
  if (type == "question") {
    legendText = `pending ${isLegendFull ? "(yet to vote)" : ""}`;
  }

  return (
    <div
      className={`${isLegendFull ? "text-sm" : ""} flex ${
        isTable || isSlotDetails ? "h-full w-full" : ""
      } items-center ${isTable ? "mx-[5px] shrink-0 basis-[80px]" : ""}`}
    >
      <div
        className={`flex ${
          isLegend || isLegendFull ? "h-6 w-6 shrink-0" : "h-full w-full"
        } items-center justify-center ${clsx(
          (isYes || isYesThin) && "bg-emerald-100",
          (isNo || isNoThin) && "bg-neutral-200",
          isIfneedbe && "bg-yellow-200",
          isQuestion && "bg-gray-200",
          isPending && "bg-gray-100"
        )}`}
      >
        {isYes && <YesTickSvg className={`${isTable ? "w-7" : "w-4"} text-green-700`} />}
        {isYesThin && <YesThinTick className={`${isTable ? "w-7" : "w-5"} text-lime-700`} />}

        {isNo && <NoTickSvg className={`${isTable ? "w-7" : "w-4"} text-slate-400`} />}
        {isNoThin && <NoThinTickSvg className={`${isTable ? "w-7" : "w-5"} text-slate-400`} />}

        {isIfneedbe && <IfNeedBeSvg className={`${isTable ? "w-6" : "w-6"}  text-yellow-700`} />}
        {isQuestion && <QuestionSvg className={`${isTable ? "h-7 w-7" : "h-6 w-6"} text-gray-500`} />}
        {isPending && <PendingSvg className={`${isTable ? "w-7" : "w-5"} text-slate-400`} />}
      </div>
      {isLegend || isLegendFull ? <div className="shrink-0 pl-1 ">{legendText}</div> : ""}
    </div>
  );
}
