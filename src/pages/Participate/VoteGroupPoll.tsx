import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { NO_VOTE } from "../../others/Constants";

import Button from "../../components/Button";
import { useVote } from "../../context/voteContext";
import MeetingOverview from "../../components/MeetingOverview";
import ResponseLegend from "../../components/ResponseLegend";
import ParticipationHeaders from "../../components/ParticipationHeader";
import PaginationWrapper, { PaginationContext } from "../../components/PaginationWrapper";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "../../components/MotionDiv";
import ParticipantNameLabel from "../../components/ParticipantNameLabel";
import ResponsesTable from "../../components/ResponsesTable";
import SlotDetails from "../../components/SlotDetails";
import SlotVote from "../../components/SlotVote";

export default function VoteGroupPoll() {
  let params = useParams();
  const { test, pollData, setPollId, userResponses, setUserResponses, participant } = useVote();
  console.log(test);
  console.log("VoteGroupPoll rendering");
  console.log("pollData", pollData);

  console.log("responses", userResponses);
  const navigate = useNavigate();
  const pollId = params.groupPollId || "";
  useEffect(() => setPollId(pollId));

  const pollDataAvailable = !!pollData;
  const urlConfirmPage = `/meeting/participate/id/${pollId}/vote/confirm`;
  useEffect(() => {
    console.log("usef1", pollDataAvailable, userResponses, pollData);
    if (userResponses || !pollDataAvailable) return;
    console.log("in", declineAllSlots(pollData));
    declineAllSlots(pollData);
  }, [pollDataAvailable]);

  if (!pollData || !userResponses) return <span>no data yet</span>;

  const isAllDeclined = userResponses.every((r) => {
    return r.response === NO_VOTE;
  });

  const maxSlotsPerPage = 5;

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <MeetingOverview />

      <div className=" relative w-full sm:px-0 lg:w-[750px] lg:border lg:border-slate-300">
        <div className="flex  flex-col	 justify-between lg:mx-8 lg:mt-8">
          <ParticipationHeaders
            mainText="Select your preferred times"
            subText="We’ll let you know when the organizer picks the best time"
          />

          <div className=" mx-4 lg:hidden ">
            <p className="mb-2 font-semibold">Availabilities</p>
            <ResponseLegend column={false} extended={false} />
          </div>

          <div className=" ">
            <PaginationWrapper slotList={pollData.slots} maxSlotsPerPage={maxSlotsPerPage} variant="vote">
              <VoteTable />
            </PaginationWrapper>
          </div>
        </div>
        <div className="z-999 fixed left-0 bottom-0 flex w-full items-center justify-between border-t  border-slate-300 bg-white py-3 px-4 shadow-[0_-5px_18px_rgb(161_167_171_/_50%)] lg:absolute lg:py-4 lg:shadow-none ">
          <Button onClick={declineHandler} variant="secondary">
            Decline
          </Button>
          <span className="hidden lg:inline-block">Selecting more times makes it easier to find the best option</span>
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

function VoteTable() {
  const { test, pollData, setPollId, userResponses, setUserResponses, participant, isDesktop } = useVote();
  console.log("isDesktop", isDesktop);
  console.log(pollData);
  const { slotsShown, isOverview } = useContext(PaginationContext);
  console.log("isOverview in VoteTable", isOverview);
  if (!slotsShown) return <span>no data yet</span>;
  return (
    <div
      style={{
        gridTemplateColumns: `228px 490px`,
        gridTemplateRows: `auto auto 200px`, //repeat(${participants.length},48px),
        gridTemplateAreas: `
'top-left${" slots".repeat(slotsShown.length)} '
'.${" yes-count".repeat(slotsShown.length)}'
'${" participants".repeat(slotsShown.length + 1)}'
`,
      }}
      className="flex flex-col lg:grid"
    >
      <div className="hidden h-full w-full flex-col justify-end lg:flex " style={{ gridArea: "top-left" }}>
        {isOverview ? (
          <div></div>
        ) : (
          <ParticipantNameLabel
            participant={{
              name: "You",
              email: "",
            }}
          />
        )}
      </div>
      <div
        style={{ gridArea: "slots" }}
        className=" mb-[66px] mt-4 flex flex-col border-t border-slate-300 lg:mb-0 lg:flex-row lg:border-t-0"
      >
        <AnimatePresence initial={false} mode={"wait"}>
          {pollData.slots
            .filter((s) => slotsShown.includes(s.id))
            .map((event) => {
              return (
                <MotionDiv key={event.id}>
                  {isOverview ? (
                    <SlotDetails key={event.id.toString()} event={event} />
                  ) : (
                    <SlotVote
                      key={event.id.toString()}
                      slot={event}
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
                  )}
                </MotionDiv>
              );
            })}
        </AnimatePresence>
      </div>
      <ResponsesTable
        displayedSlotsIds={slotsShown}
        pollData={pollData}
        excludedParticipantEmail={isOverview ? "" : participant?.email}
        polePositionParticipantEmail={isOverview ? participant.email : ""}
      />
    </div>
  );
}
