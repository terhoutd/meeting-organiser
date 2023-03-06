import React from "react";
import YesTickSvg from "../assets/YesTickSvg";
import { IFNEEDBE_VOTE, NO_VOTE, YES_VOTE } from "../others/Constants";
import { ParticipantFullInfo } from "../others/Types";

export default function SlotYesCount({
  slotId,
  participants,
}: {
  slotId: string | number;
  participants: ParticipantFullInfo[];
}) {
  const YesCount = participants.filter((p) => {
    const response = p.responses?.find((r) => r.id == slotId)?.response;
    return response == YES_VOTE || response == IFNEEDBE_VOTE;
  }).length;
  return (
    <div className="flex gap-1 py-1">
      <YesTickSvg className={"w-4"} />
      {YesCount}
    </div>
  );
}
