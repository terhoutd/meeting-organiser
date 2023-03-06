import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { NO_VOTE } from "../../others/Constants";

import Button from "../../components/Button";
import { useVote } from "../../context/voteContext";
import FullResponseTable from "../../components/FullResponseTable";
import OverviewPanel from "../../components/OverviewPanel";

export default function VoteGroupPoll() {
  let params = useParams();
  const { test, pollData, setPollId, userResponses, setUserResponses, participant } = useVote();
  console.log(test);
  console.log("VoteGroupPoll rendering");
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
    <div className="flex h-full">
      <OverviewPanel />

      <div className="flex w-full w-[750px]	 flex-col px-2 pt-8 sm:px-0">
        <div className="">
          <h1 class="text-2xl font-normal" data-testid="instructions-main-title">
            Select your preferred times
          </h1>
          <p class="chakra-text css-lr1cgg">We’ll let you know when the organizer picks the best time</p>
        </div>
        <FullResponseTable maxSlotsPerPage={maxSlotsPerPage} />
        <div className=" flex items-center justify-between border-t border-slate-300 px-4 py-4 ">
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
