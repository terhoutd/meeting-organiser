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
import { YES_VOTE } from "../../others/Constants";
import { uploadParticipantInfo } from "../../others/helpers";
import { CloseSvg } from "../../assets/CloseSvg";
import { m } from "framer-motion";
import Button from "../../components/Button";
import { useVote } from "../../context/voteContext";

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
type CreateEditGroupPollVariant = "create" | "edit";
export function CreateEditGroupPoll({ variant }: { variant: CreateEditGroupPollVariant }) {
  const isEdit = variant === "edit";
  const params = useParams();
  const pollId = isEdit ? params.groupPollId : "";

  const { pollData } = useVote();
  const isPollDataAvailable = !!pollData;
  const [loading, setLoading] = useState(isEdit);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [duration, setDuration] = useState<Duration>(60);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const defaultIndex = 2;
  const clickedDurationTabIndexRef = useRef<number>(defaultIndex);
  const previousDurationTabIndexRef = useRef<number>(defaultIndex);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  useEffect(() => {
    if (!isEdit || loading) return;
    setEvents(pollData.slots);
    setTitle(pollData.title);
    setEmail(pollData.organiserEmail);
    setName(pollData.organiserName);
  }, [loading]);

  const navigate = useNavigate();
  const components = {
    toolbar: Toolbar,
    week: { header: CalendarWeekHeader },
    event: ({ event, title }) => {
      return (
        <div>
          {event.title}
          <div
            className="cross"
            onClick={() => {
              console.log("click");
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
  };

  const updatePollHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      // if (!pollId) return;
      await setDoc(doc(db, "group polls", pollId as string), {
        title: title,
        slots: events,
        organiserEmail: email,
        organiserName: name,
        //participants: [defaultVotes],
      });
      console.log("Document written with ID: ", docRef.id);
      uploadParticipantInfo(pollId, {
        isOrganiser: true,
        name: name,
        email: email,
        responses: defaultResponses,
      });

      navigate("/meeting/organize/id/" + pollId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const createPollHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const defaultResponses = events.map((ev) => {
        return { id: ev.id, response: YES_VOTE as responseOption };
      });
      const docRef = await addDoc(collection(db, "group polls"), {
        title: title,
        slots: events,
        organiserEmail: email,
        organiserName: name,
        //participants: [defaultVotes],
      });
      console.log("Document written with ID: ", docRef.id);
      const pollId = docRef.id;
      uploadParticipantInfo(pollId, {
        isOrganiser: true,
        name: name,
        email: email,
        responses: defaultResponses,
      });

      navigate("/meeting/organize/id/" + pollId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  function getIsAllDayEventClick({ start, end }: ClickEvent) {
    const { momentStart, momentEnd } = getMomentStartAndEndDate({ start, end });
    const comp = momentStart.clone().add(24, "hours");
    return momentEnd.isSame(comp);
  }
  function getMomentStartAndEndDate({ start, end }: { start: Date; end: Date }) {
    return { momentStart: moment(start), momentEnd: moment(end) };
  }
  const handleSelectSlot = useCallback(
    (event: ClickEvent) => {
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

  useEffect(() => {
    setEvents(
      events.map((ev) => {
        return getComposedTimeEvent(ev, duration);
      })
    );
  }, [duration]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="">
      <form onSubmit={isEdit ? updatePollHandler : createPollHandler}>
        <div className="w-full border border-zinc-100 bg-white p-4 lg:p-8">
          <h1 className="ml-[-32px] border-b pb-8 text-4xl ">Create group poll</h1>
          <div
            className=" my-8
           flex flex-col"
          >
            <label htmlFor="name">Your name</label>
            <input
              required
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 px-2 py-2"
            />
          </div>
          <div className=" my-8 flex flex-col">
            <label htmlFor="email">Your email</label>
            <input
              required
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py4 border-2 px-2 py-2"
            />
          </div>
          <div className=" my-8 flex flex-col">
            <label htmlFor="title">Title of your poll</label>
            <input
              required
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="py4 border-2 px-2 py-2"
            />
          </div>
        </div>
        <div className="mt-2 w-full border border-zinc-100 bg-white  p-4 lg:p-8 ">
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
          <div className="rbc-wrapper" style={{ height: "660px" }}>
            <DnDCalendar
              slotPropGetter={slotPropGetter}
              localizer={localizer}
              events={events}
              onSelectSlot={(p) => {
                console.log(p);
                handleSelectSlot(p);
              }}
              selectable
              onSelecting={() => false}
              step={30}
              timeslots={2}
              views={["week"]}
              defaultView={"week"}
              // timeslots={1 * (60 / step)}
              toolbar={true}
              components={components as any}
              onEventDrop={onEventDrop}
              resizable={false}
              showMultiDayTimes={true}
            />
          </div>
        </div>

        <div className="flex justify-end">
          {isEdit ? (
            <input
              type="button"
              onClick={() => {
                navigate("/meeting/organize/id/" + pollId);
              }}
              className="mr-7 mt-7 bg-blue-600 p-3 text-white"
              value={"Cancel"}
            />
          ) : (
            ""
          )}
          <input
            type="submit"
            className="mr-7 mt-7 bg-blue-600 p-3 text-white"
            value={isEdit ? "Save" : "Create invite and continue"}
          />
        </div>
      </form>
    </div>
  );
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

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xl rounded bg-white p-12">
          <Dialog.Title className={"mb-5 text-3xl"}>Change the duration of the meeting</Dialog.Title>
          <Dialog.Description className={"text-md text-zinc-600"}>
            Both all-day and time-specific options are not supported in the same meeting, please choose one type of
            option:
          </Dialog.Description>
          <div className="mt-16 flex justify-center gap-4">
            <Button
              variant="link"
              onClick={() => {
                setIsOpen(false);
                setEvents([]);
                setDuration(durationFromClickedTab);
                setSelectedIndex(clickedDurationTabIndexRef.current);
              }}
              className="h-16 w-56 p-6"
            >
              {allDayWasClicked ? "Switch to all-day options" : "Switch to time-specific options"}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsOpen(false);
              }}
              className="h-16 w-56"
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
  const cutOffDate = new Date();
  if (moment(cutOffDate).isAfter(date)) {
    return { className: "rbc-time-slot-expired" };
  }
  return {};
}
