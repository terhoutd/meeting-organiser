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
import { VoteTable } from "../../components/VoteTable";
import EventMetaData from "../../components/EventMetaData";

export default function OverviewVoteGroupPoll() {
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

  const maxSlotsPerPage = 8;

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <div className=" relative w-full sm:px-0 lg:border lg:border-slate-300">
        <div className="flex  flex-col	 justify-between lg:mx-6 lg:mt-8">
          <EventMetaData excludeParticipantCount={true} />

          <div className="">
            <p className="mb-2 font-semibold">Availabilities</p>
          </div>

          <div className=" ">
            <PaginationWrapper slotList={pollData.slots} maxSlotsPerPage={maxSlotsPerPage} variant="overview">
              <VoteTable />
            </PaginationWrapper>
          </div>
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
