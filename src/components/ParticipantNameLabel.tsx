import React from "react";
import { Participant } from "../others/Types";
export default function ParticipantNameLabel({ participant }: { participant: Participant }) {
  return (
    <div className=" flex w-full items-center justify-start gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50  lg:h-8 lg:w-8">
        {participant.name?.charAt(0).toUpperCase() || "?"}
      </span>
      <span className="flex flex-col items-start">
        <div className={`justify-self-start  ${participant.isOrganiser ? "font-semibold" : ""}`}>
          {participant.name}
        </div>
        {participant.isOrganiser && <div className={`hidden justify-self-start text-sm lg:block`}>Organizer</div>}
      </span>
    </div>
  );
}
