import { useCallback, useMemo, useRef, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
// import currentEvents from "./defaultEvents";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Tab } from "@headlessui/react";
import Toolbar from "./Toolbar";
const localizer = momentLocalizer(moment);
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";

import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { CalEvent } from "./Types";

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
  const navigate = useNavigate();
  const components = {
    toolbar: Toolbar,
  };
  const createPollHandler = async () => {
    try {
      const docRef = await addDoc(collection(db, "group polls"), {
        title: title,
        events: events,
      });
      console.log("Document written with ID: ", docRef.id);
      console.log(docRef);

      navigate("/organize/group/id/" + docRef.id);
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
      <div className="w-full max-w-md px-2 py-16 sm:px-0">
        <form>
          <label htmlFor="title">Title of your poll</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 m-2"
          />
        </form>

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
                    "w-full rounded-none text-gray-500 ring-2 focus:outline-none py-2",
                    selected ? " ring-blue-700 bg-blue-600 text-white" : ""
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
          components={components}
        />
      </div>
      <div className="flex justify-end">
        <button onClick={createPollHandler} className="mr-5 mt-5 bg-blue-600 text-white p-3">
          create invite and continue
        </button>
      </div>
    </div>
  );
}

export default CreateGroupPoll;
