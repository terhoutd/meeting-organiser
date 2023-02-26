import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import SlotVote from "../../components/SlotVote";
import { FsSlot, ParticipantFullInfo, TimesResponse } from "../../others/Types";
import { NO_VOTE } from "../../others/Constants";
import ResponsesTable from "../../components/ResponsesTable";
import usePollData from "../../hooks/usePollData";
import ParticipantNameLabel from "../../components/ParticipantNameLabel";
import PaginationRow from "../../components/PaginationRow";
import Button from "../../components/Button";
import { UseVote } from "../../context/voteContext";

export default function VoteGroupPoll() {
  let params = useParams();
  const { test } = UseVote();
  console.log(test);
  const [userResponses, setUserResponses] = useState<TimesResponse[]>([]);
  const [slotPage, setSlotPage] = useState(1);
  console.log("VoteGroupPoll rendering");
  console.log("responses", userResponses);
  const navigate = useNavigate();
  const pollId = params.groupPollId || "";
  const urlConfirmPage = `/meeting/participate/id/${pollId}/vote/confirm`;
  const pollData = usePollData({
    pollId: pollId,
    callback: (pollData) => {
      declineAllSlots(pollData);
    },
  });

  if (!pollData) return <span>no data yet</span>;

  const { slots, participants }: { slots: FsSlot[]; participants: ParticipantFullInfo[] } = pollData;
  const maxSlotsPerPage = 5;
  const maxPage = Math.ceil(slots.length / maxSlotsPerPage);
  const displayedSlotsIds = slots
    .filter((s, index) => index > (slotPage - 1) * maxSlotsPerPage && index <= slotPage * maxSlotsPerPage)
    .map((s) => s.id);

  const isAllDeclined = userResponses.every((r) => {
    return r.response === NO_VOTE;
  });
  return (
    <div>
      Vote {pollId}
      <div className="w-full max-w-[750px] overflow-hidden	 px-2 py-16 sm:px-0">
        <PaginationRow
          left={{
            onClick: () => {
              setSlotPage((p) => {
                if (p > 1) return p - 1;
                return p;
              });
            },
            disabled: slotPage === 1,
          }}
          right={{
            onClick: () => {
              setSlotPage((p) => {
                if (p < maxPage) return p + 1;
                return p;
              });
            },
            disabled: slotPage === maxPage,
          }}
          options={pollData.slots.length}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `226px repeat(${displayedSlotsIds.length}, 90px [col-start])`,
            gridTemplateRows: `1fr repeat(${participants.length},48px)`,
            placeItems: "center",
            gap: "10px 10px",
          }}
        >
          <div className="flex h-full w-full flex-col justify-end">
            <ParticipantNameLabel
              participant={{
                name: "You",
                email: "",
              }}
            />
          </div>
          {slots
            .filter((s) => displayedSlotsIds.includes(s.id))
            .map((event) => {
              return (
                <SlotVote
                  key={event.id.toString()}
                  event={event}
                  vote={userResponses.find((v) => v.id == event.id)?.response as string}
                  setVote={(vote) => {
                    setUserResponses(
                      userResponses.map((v) => {
                        if (v.id != event.id) return v;
                        return { id: v.id, response: vote };
                      })
                    );
                  }}
                />
              );
            })}
          <ResponsesTable displayedSlotsIds={displayedSlotsIds} pollData={pollData} />
        </div>
        <div className="mt-4 flex items-center justify-around">
          <Button onClick={declineHandler} variant="secondary">
            Decline
          </Button>
          <span>Selecting more times makes it easier to find the best option</span>
          <Button onClick={continueHandler} disabled={isAllDeclined}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
  function declineAllSlots(pollData) {
    setUserResponses(
      pollData.slots.map((ev) => {
        return { id: ev.id, response: NO_VOTE };
      })
    );
  }
  function declineHandler() {
    declineAllSlots(pollData);
    navigate(urlConfirmPage);
  }
  function continueHandler(e) {
    navigate(urlConfirmPage);
  }
}
