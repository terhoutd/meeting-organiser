import React from "react";
import { useVote } from "../context/voteContext";
import TickboxIfneedbe from "./TickboxIfneedbe";
import TickBoxNo from "./TickBoxNo";
import TickBoxQuestion from "./TickBoxQuestion";
import TickBoxYes from "./TickBoxYes";

export default function OverviewPanel() {
  const { pollData } = useVote();
  if (!pollData) return <div>waiting</div>;
  return (
    <div className={"w-[250px] pl-8 pt-8"}>
      <div className="font-medium">{pollData.organiserName}</div>
      <div>is organizing</div>
      <div className="mt-4 mb-5 text-lg font-medium">{pollData.title}</div>
      <div className="flex flex-col gap-2">
        <TickBoxYes variant={"legend-full"} />
        <TickboxIfneedbe variant={"legend-full"} />
        <TickBoxNo variant={"legend-full"} />
        <TickBoxQuestion variant={"legend-full"} />
      </div>
    </div>
  );
}
