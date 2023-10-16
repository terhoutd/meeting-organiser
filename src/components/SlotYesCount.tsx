import React from "react";
import YesTickSvg from "../assets/YesTickSvg";
import { IFNEEDBE_VOTE, NO_VOTE, YES_VOTE } from "../others/Constants";
import { ParticipantFullInfo } from "../others/Types";
import { PeopleSvg } from "../assets/PeopleSvg";

export default function SlotYesCount({
  slotId,
  participants,
  countIcon = "tick",
  className = "",
}: {
  slotId: string | number;
  participants: ParticipantFullInfo[];
  countIcon?: "tick" | "people";
  className?: string;
}) {
  const YesCount = participants.filter((p) => {
    const response = p.responses?.find((r) => r.id == slotId)?.response;
    return response == YES_VOTE || response == IFNEEDBE_VOTE;
  }).length;
  return (
    <div className="flex gap-1 py-4">
      {countIcon == "people" && <PeopleSvg className={className} />}
      {countIcon == "tick" && <YesTickSvg className={`${className} w-4`} />}
      {YesCount}
    </div>
  );
}
