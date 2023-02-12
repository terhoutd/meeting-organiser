import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import YesTickBox from "./assets/YesTickBox";
import NoTickBox from "./assets/NoTickBox";
import SlotVote from "./SlotVote";
import { CalEvent, FsCalEvent } from "./Types";
import { NO_VOTE } from "./Constants";
import ExistingVoteRow from "./ExistingVoteRow";

export default function VoteGroupPoll() {
  let params = useParams();
  let [events, setEvents] = useState<FsCalEvent[]>();
  const [name, setName] = useState("");
  const [currentVotes, setCurrentVotes] = useState([]);
  const [usersVotes, setUsersVotes] = useState([]);
  console.log("VoteGroupPoll rendering");
  console.log("votes", currentVotes);
  console.log("events", events);

  useEffect(() => {
    async function fetchData() {
      const pollDocRef = doc(db, "group polls", params.groupPollId || "");
      const docSnap = await getDoc(pollDocRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const newEvents = docSnap.data().events.map(({ id, title, start, end }: CalEvent) => {
          return {
            id: id,
            title: title,
            start: start,
            end: end,
          };
        });
        setEvents(newEvents);
        setCurrentVotes(
          newEvents?.map((ev) => {
            return { id: ev.id, vote: NO_VOTE };
          })
        );
        const votesDocs = await getDocs(collection(pollDocRef, "votes"));
        console.log(votesDocs);
        setUsersVotes(
          votesDocs.docs.map((v) => {
            return v.data();
          })
        );
        votesDocs.forEach((d) => {
          console.log(d.id, "=====", d.data());
        });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    console.log("new votes", currentVotes);
  }, [currentVotes]);
  const voteHandler = async () => {
    try {
      const pollDocRef = doc(db, "group polls", params.groupPollId as string);
      await setDoc(doc(pollDocRef, "votes", name), {
        name: name,
        votes: currentVotes,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return events?.length ? (
    <div>
      ManageGroupPoll {params.groupPollId}
      <form>
        <label htmlFor="title">Your name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="border-2 m-2" />
      </form>
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
        {events.map((event) => {
          return (
            <SlotVote
              key={event.id.toString()}
              event={event}
              vote={currentVotes?.find((v) => v.id == event.id).vote}
              setVote={(vote) => {
                setCurrentVotes(
                  currentVotes.map((v) => {
                    if (v.id != event.id) return v;
                    return { id: v.id, vote: vote };
                  })
                );
              }}
            />
          );
        })}
        {usersVotes.map((userVoteData) => {
          return (
            <ExistingVoteRow
              key={userVoteData.name}
              userVotes={userVoteData.votes}
              userName={userVoteData.name}
              events={events}
            />
          );
        })}
      </div>
      <button onClick={voteHandler} className="mr-5 mt-5 bg-blue-600 text-white p-3">
        Vote
      </button>
    </div>
  ) : (
    <span>no data yet</span>
  );
}
