import { useCallback, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Tab } from "@headlessui/react";
import Toolbar from "../../components/Toolbar";
const localizer = momentLocalizer(moment);
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../others/firebase";
import { CalEvent, responseOption } from "../../others/Types";
import { YES_VOTE } from "../../others/Constants";
import { uploadParticipantInfo } from "../../others/helpers";

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
];

function CreateGroupPoll() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [step, setStep] = useState(60);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const components = {
    toolbar: Toolbar,
  };
  console.log("hi2");
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
        const id = prev.length;
        const title = "";
        const newEv = { start, end, title, id };
        const newEvList = [...prev, newEv];
        console.log(newEvList);
        return newEvList;
      });
    },
    [setEvents]
  );
  return (
    <div className="">
      <form onSubmit={createPollHandler}>
        <div className="w-full max-w-md px-2 py-16 sm:px-0">
          <div>
            <label htmlFor="title">Title of your poll</label>
            <input
              required
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="m-2 border-2"
            />
          </div>
          <div>
            <label htmlFor="name">Your name</label>
            <input
              required
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="m-2 border-2"
            />
          </div>
          <div>
            <label htmlFor="email">Your email</label>
            <input
              required
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="m-2 border-2"
            />
          </div>

          <Tab.Group>
            <Tab.List className="flex space-x-0.5 rounded-sm">
              {durations.map((d) => (
                <Tab
                  key={d.title}
                  onClick={() => {
                    setStep(d.duration);
                  }}
                  className={({ selected }) =>
                    clsx(
                      "w-full rounded-none py-2 text-gray-500 ring-2 focus:outline-none",
                      selected ? " bg-blue-600 text-white ring-blue-700" : ""
                    )
                  }
                >
                  {d.title}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
        <div className="" style={{ height: "660px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            onSelectSlot={handleSelectSlot}
            selectable
            onSelecting={() => false}
            step={step}
            views={["week"]}
            defaultView={"week"}
            timeslots={1 * (60 / step)}
            toolbar={true}
            components={components as any}
          />
        </div>
        <div className="flex justify-end">
          <input type="submit" className="mr-5 mt-5 bg-blue-600 p-3 text-white" value={"create invite and continue"} />
        </div>
      </form>
    </div>
  );
}

export default CreateGroupPoll;
