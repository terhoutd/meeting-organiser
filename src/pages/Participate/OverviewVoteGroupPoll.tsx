import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { NO_VOTE } from "../../others/Constants";

import Button from "../../components/Button";
import { useVote } from "../../context/voteContext";

import PaginationWrapper, { PaginationContext } from "../../components/PaginationWrapper";

import { VoteTable } from "../../components/VoteTable";
import EventMetaData from "../../components/EventMetaData";
import CalendarAcceptIcon from "../../assets/CalendarSvg";
import ResponseLegend from "../../components/ResponseLegend";

export default function OverviewVoteGroupPoll() {
  let params = useParams();
  const { test, pollData, setPollId, userResponses, setUserResponses, participant, setPageType } = useVote();
  console.log(test);
  console.log("VoteGroupPoll rendering");
  console.log("pollData", pollData);

  console.log("responses", userResponses);
  const navigate = useNavigate();
  const pollId = params.groupPollId || "";
  useEffect(() => {
    setPollId(pollId);
    setPageType("vote overview");
  }, []);

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
  const changeResponseHandler = () => {
    navigate(`/meeting/participate/id/${pollId}/vote`);
  };
  return (
    <div className="flex h-full flex-col ">
      <div className=" relative mb-5 w-full border border-slate-300 bg-white p-4 lg:p-8">
        <div className="align-center flex">
          <div className="mr-[10px]">
            <CalendarAcceptIcon />
          </div>
          <h1 className="text-[18px]">Response submitted!</h1>
        </div>
        <div className="lg:text=[28px] my-[10px] text-[16px]">
          Now it’s up to the organizer. We’ll email you at <b>{participant.email}</b> when they choose a final time.
        </div>
        <Button onClick={changeResponseHandler} variant="secondary">
          Change your response
        </Button>
      </div>
      <div className=" relative w-full border border-slate-300 bg-white sm:px-0">
        <div className="flex  flex-col	 justify-between lg:mt-8">
          <div className="p-4 lg:px-8">
            <EventMetaData excludeParticipantCount={true} />
          </div>
          <div className=" mx-4 mb-4 lg:hidden ">
            <p className="mb-2 font-semibold">Availabilities</p>
            <ResponseLegend column={false} extended={false} />
          </div>
          <div className="lg:pl-8 ">
            <div className="mb-2 hidden lg:block">Availabilities</div>
            <PaginationWrapper
              slotList={pollData.slots}
              maxSlotsPerPage={maxSlotsPerPage}
              showLegend={true}
              showTip={false}
            >
              <div className="mr-[70px] flex justify-end lg:hidden">Your response</div>
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
