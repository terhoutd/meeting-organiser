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
  excludedParticipantEmail,
  polePositionParticipantEmail,
}: {
  pollData: PollData;
  displayedSlotsIds: any[];
  excludedParticipantEmail?: string;
  polePositionParticipantEmail?: string;
}) {
  let sortedIncludedParticipants = [...pollData.participants.filter((p) => p.email !== excludedParticipantEmail)];
  const displayedSlots = pollData.slots.filter((s) => displayedSlotsIds.includes(s.id));

  sortedIncludedParticipants.sort((a, b) => {
    if (a.email === polePositionParticipantEmail) return -1;
    if (a.isOrganiser) return -1;
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0; // names must be equal
  });
  // return (
  //   <>
  //     <div></div>
  //     {displayedSlots.map((s) => {
  //       return <SlotYesCount key={s.id} slotId={s.id} participants={sortedIncludedParticipants} />;
  //     })}
  //     <div
  //       style={{ gridColumn: "1 / -1", width: "700px", height: "200px",gridArea:'otherRespondants', backgroundColor: "red" }}
  //     ></div>
  //   </>
  // );
  return (
    <>
      <div
        style={{
          gridArea: "yes-count",
          display: "grid",
          gridTemplateColumns: `repeat(${displayedSlotsIds.length},90px)`,
          // gap: " 10px",
          placeItems: "center",
        }}
      >
        {displayedSlots.map((s) => {
          return <SlotYesCount key={s.id} slotId={s.id} participants={sortedIncludedParticipants} />;
        })}
      </div>
      <div
        style={{
          gridArea: "participants",
          display: "grid",
          gridTemplateColumns: `228px 490px`,
          height: "200px",
          overflowY: "scroll",
          gap: " 10px 0",
          placeItems: "center",
          paddingRight: "40px",
        }}
      >
        {sortedIncludedParticipants.map((participant) => (
          <React.Fragment key={participant.email}>
            <ParticipantNameLabel participant={participant} />
            <div className="flex flex-row">
              {displayedSlots.map((ev) => {
                const userVoteforEvent = participant.responses.find((uv) => uv.id === ev.id)?.response;
                const key = ev.id;
                if (userVoteforEvent == NO_VOTE) return <TickBoxNo variant="table" key={key} />;
                if (userVoteforEvent == YES_VOTE) return <TickBoxYes variant="table" key={key} />;
                if (userVoteforEvent == IFNEEDBE_VOTE) return <TickboxIfneedbe variant="table" key={key} />;
                return <TickBoxQuestion variant="table" key={key} />;
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
