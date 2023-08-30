import { memo, useCallback, useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../others/firebase";
import { CalEvent, responseOption } from "../../others/Types";
import { YES_VOTE } from "../../others/Constants";
import { uploadParticipantInfo } from "../../others/helpers";
import { CloseSvg } from "../../assets/CloseSvg";
import { m } from "framer-motion";
import Button from "../../components/Button";

const durations = [
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

function CreateGroupPoll() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [duration, setDuration] = useState<number | "all day">(60);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const navigate = useNavigate();
  const components = {
    toolbar: Toolbar,
    week: { header: CalendarWeekHeader },
    event: ({ event, title }) => {
      const momentStart = moment(event.start);
      const momentEnd = moment(event.end);
      const showStartAm = momentStart.format("a") !== momentEnd.format("a");
      const showStartMinutes = momentStart.format("mm") !== "00";
      const showEndMinutes = momentEnd.format("mm") !== "00";
      const displayStart = momentStart.format("h" + (showStartMinutes ? ":mm" : "") + (showStartAm ? " A" : ""));
      const displayEnd = momentEnd.format("h" + (showEndMinutes ? ":mm" : "") + " A");
      return (
        <div>
          {displayStart}-{displayEnd}
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
  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setEvents((prev) => {
        //check if event with same start and end exists already)
        let title = "";

        const startMoment = moment(start);
        const endMoment = moment(end);
        let newEnd: Date;
        const comp = startMoment.clone().add(24, "hours");
        if (endMoment.isSame(comp)) {
          title = "all day";
          newEnd = end;
        } else {
          newEnd = startMoment.add(duration, "minutes").toDate();
          title = "test";
        }
        if (prev.find((ev) => moment(ev.start).isSame(start) && moment(ev.end).isSame(newEnd))) return prev;
        const id = uuidv4();
        const newEv = { start, end: newEnd, title, id };
        const newEvList = [...prev, newEv];
        return newEvList;
      });
    },
    [duration]
  );

  const onEventDrop = useCallback(
    ({ start, end, event }: { start: stringOrDate; end: stringOrDate; event: object }) => {
      setEvents((prev) => {
        // const newEv = { start, end, title, id };
        const foundEv = prev.find((ev) => ev.id === event.id);
        if (!foundEv) return prev;
        foundEv.start = start;
        foundEv.end = end;
        return prev;
      });
    },
    []
  );

  useEffect(() => {
    setEvents(
      events.map((ev) => {
        const newEnd = moment(ev.start).add(duration, "minutes").toDate();
        return { ...ev, end: newEnd };
      })
    );
  }, [duration]);

  return (
    <div className="">
      <form onSubmit={createPollHandler}>
        <div className=":px-0 w-full border border-zinc-100 bg-white">
          <h1 className="border-b px-8 py-8 text-4xl ">Create group poll</h1>
          <div
            className="mx-8 my-8
           flex flex-col"
          >
            <label htmlFor="name">Your name</label>
            <input
              required
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="py4 border-2 px-2 py-2"
            />
          </div>
          <div className="mx-8 my-8 flex flex-col">
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
          <div className="mx-8 my-8 flex flex-col">
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
        <div className="mt-2 w-full border border-zinc-100 bg-white  px-8 py-8 ">
          <h2 className="pb-4  text-3xl ">Add your times</h2>
          <label className="my-2 block">Duration</label>
          <Tab.Group defaultIndex={2}>
            <Tab.List className="mb-4 flex rounded-sm">
              {durations.map((d) => (
                <Tab
                  key={d.title}
                  onClick={() => {
                    if (d.duration === "all day") setIsOpen(true);
                    else setDuration(d.duration);
                  }}
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
          <Dialog open={isOpen} onClose={() => {}}>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-xl rounded bg-white p-12">
                <Dialog.Title className={"mb-5 text-3xl"}>Change the duration of the meeting</Dialog.Title>
                <Dialog.Description className={"text-md text-zinc-600"}>
                  Both all-day and time-specific options are not supported in the same meeting, please choose one type
                  of option:
                </Dialog.Description>
                <div className="mt-16 flex justify-center gap-4">
                  <Button variant="link" onClick={() => setIsOpen(false)} className="h-16 w-56 p-6">
                    Switch to all-day options
                  </Button>
                  <Button variant="primary" onClick={() => setIsOpen(false)} className="h-16 w-56">
                    Keep time-specific options
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
          <div className="rbc-wrapper" style={{ height: "660px" }}>
            <DnDCalendar
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
          <input type="submit" className="mr-7 mt-7 bg-blue-600 p-3 text-white" value={"create invite and continue"} />
        </div>
      </form>
    </div>
  );
}

export default CreateGroupPoll;
