import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import SlotTableHeader from "./SlotTableHeader";
import YesTickBox from "./assets/YesTickBox";
import NoTickBox from "./assets/NoTickBox";

export default function ManageGroupPoll() {
  let params = useParams();
  let [events, setEvents] = useState();

  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "group polls", params.groupPollId || "");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setEvents(
          docSnap.data().events.map(({ id, title, start, end }) => {
            return {
              id: id,
              title: title,
              start: start,
              end: end,
            };
          })
        );
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    fetchData();
  }, []);

  return events ? (
    <div>
      ManageGroupPoll {params.groupPollId}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `226px repeat(${events.length}, 90px [col-start])`,
          gridTemplateRows: "1fr 48px",
          placeItems: "center",
          gap: "10px 10px",
        }}
      >
        <div></div>
        {events &&
          events.map((event) => {
            return <SlotTableHeader key={event.id} event={event} />;
          })}
        <div className="justify-self-start">eddy</div>

        <YesTickBox />
        <YesTickBox />
        <NoTickBox />
      </div>
    </div>
  ) : (
    <span>"no data yet"</span>
  );
}
