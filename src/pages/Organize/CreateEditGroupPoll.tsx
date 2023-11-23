import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Calendar, momentLocalizer, stringOrDate } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { v4 as uuidv4 } from "uuid";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import "../../customCalendar.css";
import { Dialog, Tab } from "@headlessui/react";
import Toolbar, { CalendarWeekHeader } from "../../components/Toolbar";
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

import clsx from "clsx";
import { Link, useNavigate, useParams } from "react-router-dom";

import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../others/firebase";
import { CalEvent, responseOption } from "../../others/Types";
import { COOKIE_NAME_PARTICIPANT_ID, ROOT_DOC_NAME, YES_VOTE } from "../../others/Constants";
import { uploadParticipantInfo } from "../../others/helpers";
import { CloseSvg } from "../../assets/CloseSvg";
import { m } from "framer-motion";
import Button from "../../components/Button";
import { useVote } from "../../context/voteContext";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { CustomInput } from "../../components/CustomInput";
import { useCookies } from "react-cookie";

type onSubmitValue = {
  username: string;
  email: string;
};
type DurationObject = {
  duration: Duration;
  title: string;
};
const durations: DurationObject[] = [
  {
    title: "15 min",
    duration: 15,
  },
  {
    title: "30 min",
    duration: 30,
  },
  {
    title: "60 min",
    duration: 60,
  },
  {
    title: "All day",
    duration: "all day",
  },
];
type Duration = number | "all day";
type ClickEvent = {
  action: string;
  start: Date;
  end: Date;
};

export function CreateEditGroupPoll({ variant }: { variant: "create" | "edit" }) {
  const defaultIndex = 2;
  const isEdit = variant === "edit";
  const params = useParams();
  const navigate = useNavigate();

  const pollId = isEdit ? params.groupPollId : "";
  const { pollData, isDesktop, setPollId, setPageType, setPollData } = useVote();

  const [loading, setLoading] = useState(isEdit);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [duration, setDuration] = useState<Duration>(60);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const clickedDurationTabIndexRef = useRef<number>(defaultIndex);
  const previousDurationTabIndexRef = useRef<number>(defaultIndex);
  const [cookies, setCookie] = useCookies([COOKIE_NAME_PARTICIPANT_ID]);
  const DisplayingErrorMessagesSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("We need your name so guests know who you are."),
    email: Yup.string()
      .email("Enter a vavlid email address")
      .required("We need your email to send you notifications when answers come."),
    title: Yup.string().required("We need a title for your meeting"),
  });

  useEffect(() => {
    setPollId(pollId);
    setPageType(`poll ${variant}`);
  }, []);

  useEffect(() => {
    if (isEdit && !pollData) return;
    setLoading(false);
  }, [pollData]);

  useEffect(() => {
    if (!isEdit || loading) return;
    setEvents(() => {
      return pollData.slots.map((ev) => {
        return getCalEventFromFbEvent(ev);
      });
    });
  }, [loading]);

  useEffect(() => {
    setEvents(
      events.map((ev) => {
        return getComposedTimeEvent(ev, duration);
      })
    );
  }, [duration]);

  async function updatePollHandler({ title, email, username }: onSubmitValue) {
    try {
      await setDoc(doc(db, ROOT_DOC_NAME, pollId as string), {
        title: title,
        slots: events,
        organiserEmail: email,
        organiserName: username,
      });
      // setPollData((prevState) => {
      //   if (!prevState) return;
      //   const pd = { ...prevState };
      //   pd.title = title;
      //   pd.slots = events;
      //   pd.organiserEmail = email;
      //   pd.organiserName = username;
      //   return pd;
      // });

      navigate("/meeting/organize/id/" + pollId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  async function createPollHandler({ title, email, username }: onSubmitValue) {
    try {
      const defaultResponses = events.map((ev) => {
        return { id: ev.id, response: YES_VOTE as responseOption };
      });
      const docRef = await addDoc(collection(db, ROOT_DOC_NAME), {
        title: title,
        slots: events,
        organiserEmail: email,
        organiserName: username,
      });
      console.log("Document written with ID: ", docRef.id);
      const pollId = docRef.id;
      const participantId = await uploadParticipantInfo(pollId, {
        isOrganiser: true,
        name: username,
        email: email,
        responses: defaultResponses,
      });
      setCookie(COOKIE_NAME_PARTICIPANT_ID, participantId, { path: "/" });
      navigate("/meeting/organize/id/" + pollId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const handleSelectSlot = useCallback(
    (event: ClickEvent) => {
      // console.log("handleSelectSlot");
      //discard if start date is in the past
      if (isDateInThePast(event.start)) return;
      const isAllDayEventClick = getIsAllDayEventClick(event);
      const isDurationAllDay = duration === "all day";
      if (isAllDayEventClick !== isDurationAllDay) {
        //discard click event because not in line with current duration type
        return;
      }
      let composedEvent: CalEvent;
      if (isDurationAllDay) {
        composedEvent = { start: event.start, end: event.end, title: "All day", id: uuidv4() };
      } else {
        composedEvent = getComposedTimeEvent(event, duration);
      }

      const eventAlreadyExists = !!events.find(
        (loopedEv) =>
          moment(loopedEv.start).isSame(composedEvent.start) && moment(loopedEv.end).isSame(composedEvent.end)
      );
      if (eventAlreadyExists) return;

      setEvents((prev) => {
        const newEvList = [...prev, composedEvent];
        return newEvList;
      });
    },
    [events, duration]
  );

  const onEventDrop = useCallback(({ start, end, event }: { start: Date; end: Date; event: CalEvent }) => {
    console.log(start, end, event);
    setEvents((prev) => {
      // const newEv = { start, end, title, id };
      const newEvents = [...prev];
      const foundEv = newEvents.find((ev) => ev.id === event.id);
      if (!foundEv) return newEvents; //this should not happen
      foundEv.start = start;
      foundEv.end = end;
      return newEvents;
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="">
      {/* <form className="overflow-x-hidden"> */}
      <div className="w-full border border-zinc-100 bg-white p-4 lg:p-8">
        <h1 className="ml-[-22px] mr-[-22px] border-b px-4 pb-8 text-4xl">Create group poll</h1>
        <div className=" my-8 flex flex-col">
          <Formik
            initialValues={{
              username: pollData?.organiserName || "",
              email: pollData?.organiserEmail || "",
              title: pollData?.title || "",
            }}
            validationSchema={DisplayingErrorMessagesSchema}
            onSubmit={(values: onSubmitValue) => {
              // same shape as initial values
              console.log(values);
              // voteHandler(values);
              isEdit ? updatePollHandler(values) : createPollHandler(values);
            }}
          >
            {({ errors, touched, isValid, values }) => (
              <Form>
                <div className="mb-4">
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
                <div className="mb-4">
                  <label className="block" htmlFor="email">
                    Your email
                  </label>
                  <Field name="email" component={CustomInput} placeholder="e.g. john.doe@email.com" />
                  {/* If this field has been touched, and it contains an error, display
           it */}
                  {touched.email && errors.email && <div className="mt-2 text-red-500">{errors.email as string}</div>}
                </div>
                <div className="mb-4">
                  <label className="block" htmlFor="title">
                    Title
                  </label>
                  <Field name="title" component={CustomInput} placeholder="my meeting" />
                  {/* If this field has been touched, and it contains an error, display
           it */}
                  {touched.title && errors.title && <div className="mt-2 text-red-500">{errors.title as string}</div>}
                </div>
                <div className="fixed right-0 bottom-0 z-10 flex  w-full  justify-center border-t border-zinc-400 bg-white">
                  <div className="flex w-full max-w-[1000px] items-center justify-between px-8">
                    <span className="font-bold"> {events.length} times selected</span>
                    <div className="flex gap-3">
                      {isEdit ? (
                        <input
                          type="button"
                          onClick={() => {
                            navigate("/meeting/organize/id/" + pollId);
                          }}
                          className="my-4 bg-blue-600 p-3 text-white"
                          value={"Cancel"}
                        />
                      ) : (
                        ""
                      )}
                      <input
                        type="submit"
                        className=" my-4 bg-blue-600 p-3 text-white"
                        value={isEdit ? "Save" : isDesktop ? "Create invite and continue" : "Continue"}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="mt-2 mb-[92px] w-full border border-zinc-100 bg-white p-4 lg:p-8 ">
        <h2 className="pb-4  text-3xl ">Add your times</h2>
        <label className="my-2 block">Duration</label>
        <Tab.Group
          selectedIndex={selectedIndex}
          onChange={(i) => {
            const durationFromClickedTab = durations[i].duration;
            clickedDurationTabIndexRef.current = i;
            const curentDurationIsAllDay = duration === "all day";
            const newDurationIsAllDay = durationFromClickedTab === "all day";

            if (curentDurationIsAllDay !== newDurationIsAllDay && events.length > 0) {
              setIsOpen(true);
            } else {
              setDuration(durationFromClickedTab);
              setSelectedIndex(i);
            }
            previousDurationTabIndexRef.current = i;
          }}
        >
          <Tab.List className="mb-4 flex rounded-sm">
            {durations.map((d) => (
              <Tab
                key={d.title}
                className={({ selected }) =>
                  clsx(
                    "rounded-none border-2 py-2 px-6 focus:outline-none",
                    selected ? " border-blue-700 bg-blue-600 text-white" : "text-gray-500 "
                  )
                }
              >
                {d.title}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
        <SwitchDurationDialog
          setEvents={setEvents}
          setDuration={setDuration}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          clickedDurationTabIndexRef={clickedDurationTabIndexRef}
          setSelectedIndex={setSelectedIndex}
        />
        <div className="rbc-wrapper h-[660px] lg:mt-8 ">
          <DnDCalendar
            slotPropGetter={slotPropGetter}
            localizer={localizer}
            events={events}
            onSelectSlot={(p) => {
              console.log(p);
              handleSelectSlot(p);
            }}
            selectable={true}
            onSelecting={() => console.log("onSelecting")}
            step={30}
            timeslots={2}
            views={["week"]}
            defaultView={"week"}
            // timeslots={1 * (60 / step)}
            toolbar={true}
            components={{
              toolbar: Toolbar,
              week: { header: CalendarWeekHeader },
              event: ({ event, title }) => {
                return (
                  <div>
                    {event.title}
                    <div
                      className="cross"
                      onClick={() => {
                        console.log("click on cross");
                        setEvents((prev) => {
                          return prev.filter((ev) => ev.id !== event.id);
                        });
                      }}
                    >
                      <CloseSvg />
                    </div>
                  </div>
                );
              },
            }}
            onEventDrop={onEventDrop}
            resizable={false}
            showMultiDayTimes={true}
          />
        </div>
      </div>
      {/* </form> */}
    </div>
  );
  function getIsAllDayEventClick({ start, end }: ClickEvent) {
    const { momentStart, momentEnd } = getMomentStartAndEndDate({ start, end });
    const comp = momentStart.clone().add(24, "hours");
    return momentEnd.isSame(comp);
  }
  function getMomentStartAndEndDate({ start, end }: { start: Date; end: Date }) {
    return { momentStart: moment(start), momentEnd: moment(end) };
  }
  function getComposedTimeEvent(event: CalEvent | ClickEvent, duration: Duration): CalEvent {
    let { start } = event;
    const momentStart = moment(start);
    const momentEnd = momentStart.clone().add(duration, "minutes");

    const showStartAm = momentStart.format("a") !== momentEnd.format("a");
    const showStartMinutes = momentStart.format("mm") !== "00";
    const showEndMinutes = momentEnd.format("mm") !== "00";
    const displayStart = momentStart.format("h" + (showStartMinutes ? ":mm" : "") + (showStartAm ? " A" : ""));
    const displayEnd = momentEnd.format("h" + (showEndMinutes ? ":mm" : "") + " A");
    const title = displayStart + "-" + displayEnd;
    const id = uuidv4();
    const end = momentEnd.toDate();
    return { start, end, title, id };
  }

  function getCalEventFromFbEvent(fbEvent: any): CalEvent {
    return {
      start: fbEvent.start.toDate(),
      end: fbEvent.end.toDate(),
      title: fbEvent.title,
      id: fbEvent.id,
    };
  }
}

function SwitchDurationDialog({
  setEvents,
  setDuration,
  isOpen,
  setIsOpen,
  clickedDurationTabIndexRef,
  setSelectedIndex,
}: {
  setEvents: (event: CalEvent[]) => void;
  setDuration: (duration: Duration) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  clickedDurationTabIndexRef: React.MutableRefObject<number>;
  setSelectedIndex: (index: number) => void;
}) {
  const durationFromClickedTab = durations[clickedDurationTabIndexRef.current].duration;
  const allDayWasClicked = durationFromClickedTab === "all day";
  return (
    <Dialog open={isOpen} onClose={() => {}}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 z-10 flex items-center justify-center p-6">
        <Dialog.Panel className="w-full max-w-xl rounded bg-white p-4 lg:p-8">
          <Dialog.Title className={"mb-5 text-3xl"}>Change the duration of the meeting</Dialog.Title>
          <Dialog.Description className={"text-md text-zinc-600"}>
            Both all-day and time-specific options are not supported in the same meeting, please choose one type of
            option:
          </Dialog.Description>
          <div className="mt-4 flex flex-col justify-center gap-4 lg:mt-16 lg:flex-row">
            <Button
              variant="link"
              onClick={() => {
                setIsOpen(false);
                setEvents([]);
                setDuration(durationFromClickedTab);
                setSelectedIndex(clickedDurationTabIndexRef.current);
              }}
              className="order-1 lg:order-2"
            >
              {allDayWasClicked ? "Switch to all-day options" : "Switch to time-specific options"}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsOpen(false);
              }}
              className="order-2 lg:order-1"
            >
              {allDayWasClicked ? "Keep time-specific options" : "Keep all-day options"}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function slotPropGetter(date: Date): { className?: string; style?: object } {
  return isDateInThePast(date) ? { className: "rbc-time-slot-expired" } : {};
}
function isDateInThePast(date: Date) {
  const cutOffDate = new Date();
  return moment(cutOffDate).isAfter(date);
}
