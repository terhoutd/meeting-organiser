import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { NO_VOTE } from "../../others/Constants";

import Button from "../../components/Button";
import { useVote } from "../../context/VoteContext";
import ResponseLegend from "../../components/ResponseLegend";
import ParticipationHeaders from "../../components/ParticipationHeader";
import PaginationWrapper from "../../components/PaginationWrapper";
import { VoteTable } from "../../components/VoteTable";
import { CloseSvg } from "../../assets/CloseSvg";
import EventMetaData from "../../components/EventMetaData";
import { Participant, ParticipantFullInfo, PollData } from "../../others/Types";

export default function ManageGroupPoll() {
  const [isCopyLinkMessageOpen, setIsCopyLinkMessageOpen] = useState(false);

  const {
    pollId,
    pollData,
    userResponses,
    setUserResponses,
    setParticipant,
    setPageType,
    isPollCreated,
    setIsPollCreated,
  } = useVote();

  const navigate = useNavigate();
  useEffect(() => {
    setPageType("poll overview");
  }, []);

  const pollDataAvailable = !!pollData;
  const urlConfirmPage = `/meeting/organize/id/${pollId}/edit`;

  // useEffect(() => {
  //   if (isPollCreated)

  // }, [isPollCreated]);

  useEffect(() => {
    console.log("usef1", pollDataAvailable, userResponses, pollData);
    if (!pollDataAvailable) return;
    // // console.log("in", declineAllSlots(pollData));
    // declineAllSlots(pollData);
    const curParticipant = pollData.participants.find((p) => p.isOrganiser) as ParticipantFullInfo;
    setParticipant(curParticipant);
    setUserResponses(curParticipant.responses);
  }, [pollDataAvailable]);
  useEffect(() => {
    console.log("isPollCreated", isPollCreated);
  }, [isPollCreated]);
  if (!pollData || !userResponses) return <span>no data yet</span>;

  const isAllDeclined = userResponses.every((r) => {
    return r.response === NO_VOTE;
  });

  const maxSlotsPerPage = 8;

  return (
    <div className="h-screen ">
      <div className="mx-auto flex max-w-[1000px] flex-col bg-white lg:mt-5 lg:flex-row">
        <dialog
          open={isCopyLinkMessageOpen ? true : undefined}
          className={`fixed top-8 z-10 bg-green-700 p-4 text-white transition-opacity duration-500`}
        >
          Invite link copied!
        </dialog>

        <dialog
          open={isPollCreated ? true : undefined}
          className={`fixed top-8 z-10 bg-blue-400 px-8 py-4 text-white transition-opacity
        duration-500`}
        >
          <div className=" flex items-center gap-4">
            <span>You have successfully created your poll! Now, time to send out invites.</span>
            <div
              className="flex h-5 w-5 cursor-pointer items-center justify-center"
              onClick={() => {
                console.log("close");
                setIsPollCreated(false);
              }}
            >
              <CloseSvg />
            </div>
          </div>
        </dialog>
        {/* <Message
        isOpen={isCopyLinkMessageOpen}
        onClose={function (): void {
          setIsCopyLinkMessageOpen(false);
        }}
        backgroundColor="bg-green-700"
        description="You have successfully created your poll! Now, time to send out invites."
        autoFade={true}
      /> */}
        <div className=" relative w-full sm:px-0  lg:border lg:border-slate-300">
          <div className="  flex flex-col justify-between lg:px-8 lg:pt-8">
            <div className="mx-4 mb-6 lg:mx-0">
              <ParticipationHeaders mainText={pollData.title} />
            </div>
            <div className=" mx-4 mb-4 flex flex-col justify-between gap-3 lg:mx-0 lg:flex-row">
              {/* <ul>
                <li>You are the organizer</li>
              </ul> */}
              <div className="order-3 lg:order-1">
                <EventMetaData />
              </div>
              <div className="order-2 flex h-11 gap-2 lg:h-9">
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigate("/meeting/organize/id/" + pollId + "/edit");
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${location.protocol}//${location.host}/meeting/participate/id/${pollId}/vote`
                    );
                    setIsCopyLinkMessageOpen(true);
                    setTimeout(() => {
                      setIsCopyLinkMessageOpen(false);
                    }, 5000);
                  }}
                >
                  Share invite
                </Button>
              </div>
            </div>
            <div className=" mx-4  justify-between lg:mx-0 lg:flex">
              <p className="mb-6 font-bold">Availabilities</p>
              <ResponseLegend column={false} extended={false} />
            </div>

            <div className=" mb-2">
              <PaginationWrapper
                slotList={pollData.slots}
                maxSlotsPerPage={maxSlotsPerPage}
                showLegend={false}
                showTip={false}
              >
                <VoteTable className="my-4 lg:-mr-8" />
              </PaginationWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function declineAllSlots(pollData: PollData) {
    setUserResponses(
      pollData.slots.map((ev) => {
        return { id: ev.id, response: NO_VOTE };
      })
    );
  }
  function declineHandler() {
    declineAllSlots(pollData as PollData);
    navigate(urlConfirmPage);
  }
  function continueHandler() {
    navigate(urlConfirmPage);
  }
}
