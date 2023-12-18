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
  const { pollData, setPollId, userResponses, setUserResponses, participant, setPageType } =
    useVote();

  console.log("OverviewVoteGroupPoll rendering");
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
      <div className=" relative w-full border border-slate-300 bg-white sm:px-0">
        <div className="flex  flex-col	 justify-between   lg:px-8 lg:pt-8">
          <div className="mx-4 mt-4 lg:mx-0 lg:mt-0">
            <EventMetaData excludeParticipantCount={true} />
          </div>
          <div className=" mx-4 mb-4 lg:mx-0 lg:hidden">
            <p className="mb-2 font-semibold">Availabilities</p>
            <ResponseLegend column={false} extended={false} />
          </div>
          <div className=" ">
            <div className="mb-2 hidden lg:block">Availabilities</div>
            <PaginationWrapper
              slotList={pollData.slots}
              maxSlotsPerPage={maxSlotsPerPage}
              showLegend={true}
              showTip={false}
            >
              <div className="mr-[70px] flex justify-end lg:hidden">Your response</div>
              <VoteTable className="my-4 lg:-mr-8" />
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
