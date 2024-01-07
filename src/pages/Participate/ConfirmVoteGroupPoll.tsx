import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import MeetingOverview from "../../components/MeetingOverview";
import { MotionDiv } from "../../components/MotionDiv";
import PaginationWrapper, { PaginationContext } from "../../components/PaginationWrapper";
import ParticipationHeaders from "../../components/ParticipationHeader";

import { useVote } from "../../context/VoteContext";
import { COOKIE_NAME_PARTICIPANT_ID, NO_VOTE } from "../../others/Constants";
import { uploadParticipantInfo } from "../../others/helpers";
import { FsSlot, onSubmitValue, ParticipantFullInfo, PollData } from "../../others/Types";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CustomInput } from "../../components/CustomInput";
import SelectedSlot from "../../components/SelectedSlot";
import { VoteAndConfirmWrapper } from "../../components/VoteAndConfirmWrapper";

const emailMessage = "We need your email to send you the final event details.";
const DisplayingErrorMessagesSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("We need your name to add it to your response."),
  email: Yup.string().email(emailMessage).required(emailMessage),
});

export default function ConfirmVoteGroupPoll() {
  const navigate = useNavigate();

  const {
    pollData,
    setPollData,
    userResponses,
    participant,
    setParticipant,
    setPageType,
    pageType,
    participantIdFromCookie,
    setParticipantIdCookie,
  } = useVote();
  console.log("confirm", pollData, userResponses);
  console.log("setParticipantIdCookie", setParticipantIdCookie);
  useEffect(() => {
    setPageType("vote confirm");
  }, []);

  /*TODO  NEED TP UPDATE
  const [name, setName] = useState(participant?.name); 
  const [email, setEmail] = useState(participant?.email);
  const [slotPage, setSlotPage] = useState(1);
  */
  if (!pollData) return <span>no data yet</span>;

  const { slots }: { slots: FsSlot[] } = pollData;
  const acceptedSlots = userResponses
    .filter((r) => r.response !== NO_VOTE)
    .map((r) => {
      return { ...r, slot: pollData.slots.find((s) => s.id == r.id) };
    });
  const maxSlotsPerPage = 7;
  async function voteHandler(values: onSubmitValue) {
    const { email, username } = values;
    console.log("voteHandler", values);
    const newParticipant = {
      name: username,
      email: email,
      responses: userResponses,
    } as ParticipantFullInfo;
    //update to firestore
    const participantIdValue = (await uploadParticipantInfo(
      pollId,
      newParticipant,
      participantIdFromCookie
    )) as string;
    console.log("participantIdValue", participantIdValue);
    setParticipantIdCookie(COOKIE_NAME_PARTICIPANT_ID, participantIdValue);
    //setParticipant({ name: values.username, email: email });
    // //replicate update locally
    // setPollData((pd: PollData) => {
    //   const newPollData = { ...pd };
    //   const currentParticipant = newPollData.participants.find((p) => p.email === email);
    //   if (currentParticipant) currentParticipant.responses = userResponses;
    //   else newPollData.participants.push(newParticipant);
    //   console.log("newPollData", newPollData);
    //   return newPollData;
    // });

    navigate(`/meeting/participate/id/${pollId}`);
  }
  return (
    <VoteAndConfirmWrapper>
      <>
        <div
          className={" w-full p-4 lg:w-[250px] lg:border lg:border-r-0 lg:border-slate-300 lg:p-8"}
        >
          <MeetingOverview variant={pageType} />
        </div>
        <div className=" flex w-[100vw]  flex-col border-t border-slate-300 p-4 lg:w-[750px] lg:border lg:border-slate-300 lg:p-8 ">
          <ParticipationHeaders
            mainText="Let’s confirm your selection"
            subText={
              acceptedSlots.length == 0
                ? "You have declined this event"
                : "You’re submitting the following times"
            }
          />

          <div className={`mb-2 lg:mb-0 ${acceptedSlots.length == 0 ? "hidden" : ""}`}>
            <PaginationWrapper
              slotList={acceptedSlots}
              maxSlotsPerPage={maxSlotsPerPage}
              showLegend={false}
              showTip={false}
            >
              <SelectedSlots />
            </PaginationWrapper>
          </div>

          <Link
            className="mt-2 font-medium	text-blue-600"
            to={`/meeting/participate/id/${pollId}/vote/`}
          >
            Change
          </Link>
          <Formik
            initialValues={{
              username: participant?.name || "",
              email: participant?.email || "",
            }}
            validationSchema={DisplayingErrorMessagesSchema}
            onSubmit={(values: onSubmitValue) => {
              // same shape as initial values
              console.log(values);
              voteHandler(values);
            }}
          >
            {({ errors, touched, isValid, values }) => (
              <Form>
                {!participant && (
                  <>
                    <div className="mb-4 mt-6">
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
                      <Field
                        name="email"
                        component={CustomInput}
                        placeholder="e.g. john.doe@email.com"
                      />
                      {/* If this field has been touched, and it contains an error, display
           it */}
                      {touched.email && errors.email && (
                        <div className="mt-2 text-red-500">{errors.email as string}</div>
                      )}
                    </div>
                  </>
                )}
                <div className="fixed bottom-0 left-0 mt-7 flex  w-full items-center justify-between gap-6 border-t border-slate-300 bg-white  px-4 py-3 shadow-[0_-5px_18px_rgb(161_167_171_/_50%)] lg:static lg:justify-start  lg:border-0 lg:px-0 lg:py-4 lg:shadow-none ">
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
      </>
    </VoteAndConfirmWrapper>
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
      className=" flex-col gap-2 border-slate-300  lg:mb-0 lg:mt-6 lg:flex-row 	"
    >
      <AnimatePresence initial={false} mode={"wait"}>
        {slotsShown.map((r) => {
          const slotData = pollData.slots.find((s) => s.id === r);
          const responseData = userResponses.find((ur) => ur.id === r);
          console.log("responseData", responseData);

          return (
            <MotionDiv key={slotData.id}>
              <SelectedSlot
                key={slotData.id.toString()}
                event={slotData}
                response={responseData.response}
              />
            </MotionDiv>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
