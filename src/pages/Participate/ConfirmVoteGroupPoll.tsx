import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import MeetingOverview from "../../components/MeetingOverview";
import { MotionDiv } from "../../components/MotionDiv";
import PaginationRow from "../../components/PaginationRow";
import PaginationWrapper, { PaginationContext } from "../../components/PaginationWrapper";
import ParticipationHeaders from "../../components/ParticipationHeader";
import ResponseLegend from "../../components/ResponseLegend";
import SlotDetails from "../../components/SlotDetails";
import SlotVote from "../../components/SlotVote";
import { useVote } from "../../context/voteContext";
import usePollData from "../../hooks/usePollData";
import { NO_VOTE } from "../../others/Constants";
import { uploadParticipantInfo } from "../../others/helpers";
import { FsSlot } from "../../others/Types";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CustomInput } from "../../components/CustomInput";

const emailMessage = "We need your email to send you the final event details.";
const DisplayingErrorMessagesSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("We need your name to add it to your response."),
  email: Yup.string().email(emailMessage).required(emailMessage),
});

export default function ConfirmVoteGroupPoll() {
  async function voteHandler(values) {
    console.log(values);
    await uploadParticipantInfo(pollId, { name: values.username, email: values.email, responses: userResponses });
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
  const maxSlotsPerPage = 7;

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <MeetingOverview />

      <div className=" flex w-[100vw]  flex-col border-t border-slate-300 px-4 lg:w-[750px] lg:border lg:border-slate-300 lg:px-8  lg:pt-8">
        <ParticipationHeaders
          mainText="Let’s confirm your selection"
          subText={acceptedSlots.length == 0 ? "You have declined this event" : "You’re submitting the following times"}
        />

        <div className="mb-2 lg:mb-0 ">
          <PaginationWrapper slotList={acceptedSlots} maxSlotsPerPage={maxSlotsPerPage} variant="vote">
            <SelectedSlots />
          </PaginationWrapper>
        </div>

        <Link className="mt-2 font-medium	text-blue-600" to="/meeting/participate/id/${pollId}/vote/">
          Change
        </Link>
        <Formik
          initialValues={{
            username: participant?.name || "",
            email: participant?.email || "",
          }}
          validationSchema={DisplayingErrorMessagesSchema}
          onSubmit={(values) => {
            // same shape as initial values
            console.log(values);
            voteHandler(values);
          }}
        >
          {({ errors, touched, isValid, values }) => (
            <Form>
              {!participant && (
                <>
                  <div className="mt-6 mb-4">
                    <label className="block" htmlFor="name">
                      Your name
                    </label>
                    <Field name="username" component={CustomInput} placeholder="e.g. John Doe" />
                    {/* If this field has been touched, and it contains an error, display it
                     */}
                    {touched.username && errors.username && (
                      <div className="mt-2 text-red-500">{errors.username as string}</div>
                    )}
                  </div>
                  <div className="mb-[86px] lg:mb-0">
                    <label className="block" htmlFor="email">
                      Your email
                    </label>
                    <Field name="email" component={CustomInput} placeholder="e.g. john.doe@email.com" />
                    {/* If this field has been touched, and it contains an error, display
           it */}
                    {touched.email && errors.email && <div className="mt-2 text-red-500">{errors.email as string}</div>}
                  </div>
                </>
              )}
              <div className="fixed bottom-0 left-0 mt-7 flex  w-full items-center justify-between gap-6 border-t border-slate-300 bg-white  py-3 px-4 shadow-[0_-5px_18px_rgb(161_167_171_/_50%)] lg:static lg:justify-start  lg:border-0 lg:py-4 lg:px-0 lg:shadow-none ">
                <Button onClick={backHandler} variant="secondary">
                  Back
                </Button>
                <Button
                  variant="primary"
                  disabled={!isValid || (values.email === "" && values.username === "")}
                  type={"submit"}
                >
                  Submit response
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
  return (
    <div className="flex h-full flex-col lg:flex-row">
      <MeetingOverview />
      <div className="flex w-[100vw] flex-col	 justify-between sm:px-0 lg:w-[750px] lg:border lg:border-slate-300">
        <div className="mb-8 border-t border-slate-300 px-4  pt-4 lg:mb-0 lg:border-0 lg:pl-8">
          <h1 className=" mb-2 text-lg font-medium lg:text-2xl lg:font-normal">Let’s confirm your selection</h1>
          {acceptedSlots.length == 0 ? (
            <p> You have declined this event</p>
          ) : (
            <p>You’re submitting the following times</p>
          )}
        </div>
        <>
          <PaginationRow
            showTip={false}
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
          <div
            style={{
              gridArea: "slots",
              display: "flex",

              // gap: "10px",
            }}
            className="mb-[66px] mt-4 flex-col border-t border-slate-300 lg:mb-0 lg:flex-row lg:border-t-0"
          >
            <AnimatePresence initial={false} mode={"wait"}>
              {displayedAcceptedSlots.map((r) => {
                return (
                  <motion.div
                    key={r.id.toString()}
                    initial={{ x: rightPagination ? 50 : -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SlotDetails key={r.id.toString()} event={r.slot} response={r.response} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>

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
      </div>
    </div>
  );
  function backHandler() {
    navigate(`/meeting/participate/id/${pollId}/vote/`);
  }
}

function SelectedSlots() {
  const { slotsShown } = useContext(PaginationContext);
  const { pollData, userResponses } = useVote();
  if (!slotsShown) return <span>no data yet</span>;
  console.log("slotsShown", slotsShown);
  return (
    <div
      style={{
        gridArea: "slots",
        display: "flex",
      }}
      className=" flex-col gap-2 border-slate-300  lg:mt-6 lg:mb-0 lg:flex-row 	"
    >
      <AnimatePresence initial={false} mode={"wait"}>
        {slotsShown.map((r) => {
          const slotData = pollData.slots.find((s) => s.id === r);
          const responseData = userResponses.find((ur) => ur.id === r);
          console.log("responseData", responseData);

          return (
            <MotionDiv key={slotData.id}>
              <SlotDetails
                key={slotData.id.toString()}
                event={slotData}
                response={responseData.response}
                variant="slot-details"
              />
            </MotionDiv>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
