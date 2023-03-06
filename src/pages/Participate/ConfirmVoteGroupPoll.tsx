import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import PaginationRow from "../../components/PaginationRow";
import SlotDetails from "../../components/SlotDetails";
import SlotVote from "../../components/SlotVote";
import { useVote } from "../../context/voteContext";
import usePollData from "../../hooks/usePollData";
import { NO_VOTE } from "../../others/Constants";
import { uploadParticipantInfo } from "../../others/helpers";
import { FsSlot } from "../../others/Types";

export default function ConfirmVoteGroupPoll() {
  async function voteHandler(e) {
    e.preventDefault();
    await uploadParticipantInfo(pollId, { name: name, email: email, responses: userResponses });
    setPollData((pd) => {
      const newPollData = { ...pd };
      const currentParticipant = newPollData.participants.find((p) => p.email === email);
      if (currentParticipant) currentParticipant.responses = userResponses;
      else newPollData.participants.push({ name: name, email: email, responses: userResponses });
      console.log("newPollData", newPollData);
      return newPollData;
    });
    setParticipant({ name: name, email: email });
    navigate(`/meeting/participate/id/${pollId}`);
  }

  let params = useParams();
  const pollId = params.groupPollId || "";

  const navigate = useNavigate();

  const { pollData, setPollData, setPollId, userResponses, participant, setParticipant } = useVote();
  console.log("confirm", pollData, userResponses);

  const [name, setName] = useState(participant?.name);
  const [email, setEmail] = useState(participant?.email);
  const [slotPage, setSlotPage] = useState(1);

  if (!pollData) return <span>no data yet</span>;

  const { slots }: { slots: FsSlot[] } = pollData;
  const acceptedSlots = userResponses
    .filter((r) => r.response !== NO_VOTE)
    .map((r) => {
      return { ...r, slot: pollData.slots.find((s) => s.id == r.id) };
    });
  const maxOptionsPerPage = 7;
  const maxPage = Math.ceil(acceptedSlots.length / maxOptionsPerPage);
  const displayedAcceptedSlots = acceptedSlots.filter(
    (s, index) => index >= (slotPage - 1) * maxOptionsPerPage && index <= slotPage * maxOptionsPerPage
  );
  console.log("displayedAcceptedSlots", displayedAcceptedSlots);

  return (
    <>
      <div>Let’s confirm your selection</div>
      {acceptedSlots.length == 0 ? (
        <div> You have declined this event</div>
      ) : (
        <>
          <div>You’re submitting the following times</div>
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
            className={"mt-3 mb-4"}
          />
          <div className="mb-2  flex gap-2">
            {displayedAcceptedSlots.map((r) => {
              return <SlotDetails key={r.id.toString()} event={r.slot} response={r.response} />;
            })}
          </div>
        </>
      )}
      <Link className="font-medium text-blue-600	" to="/meeting/participate/id/${pollId}/vote/">
        Change
      </Link>
      <form onSubmit={voteHandler}>
        {!participant && (
          <>
            <div className="mt-6">
              <label className="block" htmlFor="name">
                Your name
              </label>
              <input
                required
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className=" block w-full border-2"
              />
            </div>
            <div>
              <label className="block" htmlFor="email">
                Your email
              </label>
              <input
                required
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2"
              />
            </div>
          </>
        )}

        <div className="mt-7 flex gap-6">
          <Button onClick={backHandler} variant="secondary">
            Back
          </Button>
          <Button onClick={voteHandler} variant="primary" disabled={!name || !email}>
            Submit response
          </Button>
        </div>
      </form>
    </>
  );
  function backHandler() {
    navigate(`/meeting/participate/id/${pollId}/vote/`);
  }
}
