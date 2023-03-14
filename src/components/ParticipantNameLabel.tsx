import React from "react";
import { Participant } from "../others/Types";
export default function ParticipantNameLabel({ participant }: { participant: Participant }) {
  return (
    <div className=" flex w-full items-center justify-start gap-2">
      <span className="flex h-6 w-6 items-center justify-center justify-center rounded-full bg-sky-100  lg:h-10 lg:w-10">
        {participant.name.charAt(0)}
      </span>
      <span className="flex flex-col items-start">
        <div className={`justify-self-start  ${participant.isOrganiser ? "font-bold" : ""}`}>{participant.name}</div>
        {participant.isOrganiser && <div className={`hidden justify-self-start lg:block`}>Organizer</div>}
      </span>
    </div>
  );
}
