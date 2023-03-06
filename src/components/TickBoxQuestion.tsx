import QuestionSvg from "../assets/QuestionSvg";
import { TickBox } from "../others/Types";

export default function TickBoxQuestion({ variant }: TickBox) {
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
        } items-center justify-center bg-gray-200`}
      >
        <QuestionSvg className={`${isTable ? "h-7 w-7" : "h-5 w-6"} text-gray-500`} />
      </div>
      {isLegend || isLegendFull ? (
        <div className="shrink-0 pl-1">Pending {isLegendFull ? "(yet to vote)" : ""}</div>
      ) : (
        ""
      )}
    </div>
  );
}

// export default function TickBoxQuestion2() {
//   return (
//     <div className="flex h-full w-full items-center justify-center bg-gray-200">
//       <QuestionSvg className="w-6 text-gray-500" />
//     </div>
//   );
// }
