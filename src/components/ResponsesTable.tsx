import React from "react";
import TickboxIfneedbe from "./TickboxIfneedbe";
import TickBoxNo from "./TickBoxNo";
import TickBoxQuestion from "./TickBoxQuestion";
import TickBoxYes from "./TickBoxYes";
import { IFNEEDBE_VOTE, NO_VOTE, YES_VOTE } from "../others/Constants";
import { FsSlot, PollData } from "../others/Types";
import ParticipantNameLabel from "./ParticipantNameLabel";
import SlotYesCount from "./SlotYesCount";

export default function ResponsesTable({
  pollData,
  displayedSlotsIds,
}: {
  pollData: PollData;
  displayedSlotsIds: any[];
}) {
  let sortedParticipants = [...pollData.participants];
  const displayedSlots = pollData.slots.filter((s) => displayedSlotsIds.includes(s.id));

  sortedParticipants.sort((a, b) => {
    if (a.isOrganiser) return -1;
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0; // names must be equal
  });
  return (
    <>
      <div></div>
      {displayedSlots.map((s) => {
        return <SlotYesCount key={s.id} slotId={s.id} participants={sortedParticipants} />;
      })}
      {sortedParticipants.map((participant) => (
        <React.Fragment key={participant.email}>
          <ParticipantNameLabel participant={participant} />
          {displayedSlots.map((ev) => {
            const userVoteforEvent = participant.responses.find((uv) => uv.id === ev.id)?.response;
            const key = ev.id;
            if (userVoteforEvent == NO_VOTE) return <TickBoxNo key={key} />;
            if (userVoteforEvent == YES_VOTE) return <TickBoxYes key={key} />;
            if (userVoteforEvent == IFNEEDBE_VOTE) return <TickboxIfneedbe key={key} />;
            return <TickBoxQuestion key={key} />;
          })}
        </React.Fragment>
      ))}
    </>
  );
}
