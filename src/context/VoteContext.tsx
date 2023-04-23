import { doc, setDoc } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import usePollData from "../hooks/usePollData";
import { db } from "../others/firebase";
import { TimesResponse, Participant, PollData } from "../others/Types";

import { getDoc, getDocs, collection } from "firebase/firestore";
import { FsSlot, ParticipantFullInfo } from "../others/Types";

const VoteContext = React.createContext({});
export function useVote(): any {
  return useContext(VoteContext);
}

export function VoteProvider({ children }: { children: ReactNode }) {
  const [pollId, setPollId] = useState<string>();
  const [pollData, setPollData] = useState<PollData>();
  const [userResponses, setUserResponses] = useState<TimesResponse[]>();
  const [participant, setParticipant] = useState<Participant>();
  const [sizeMode, setSizeMode] = useState<"desktop" | "mobile">(window.innerWidth >= 1024 ? "desktop" : "mobile");
  const isDesktop = sizeMode === "desktop";
  const invitedParticipants = pollData?.participants.filter((p) => !p.isOrganiser);
  const organizerParticipant = pollData?.participants.find((p) => p.isOrganiser);

  useEffect(() => {
    function handleResize() {
      setSizeMode(window.innerWidth >= 1024 ? "desktop" : "mobile");
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const pollDocRef = doc(db, "group polls", pollId);
      const pollDocSnap = await getDoc(pollDocRef);

      if (!pollDocSnap.exists()) {
        console.log("No such document!");
        return;
      }
      console.log("Document data:", pollDocSnap.data());
      const pollData = pollDocSnap.data() as PollData;
      const votesDocsSnaps = await getDocs(collection(pollDocRef, "participants"));
      console.log(votesDocsSnaps);
      pollData.participants = votesDocsSnaps.docs.map((v) => {
        return v.data() as ParticipantFullInfo;
      });
      setPollData(pollData);
      //if (callback) callback(pollData);
    }
    if (!pollId) return;
    fetchData();
  }, [pollId]);

  const value = {
    test: "hello1",
    pollData,
    setPollData,
    setPollId,
    userResponses,
    setUserResponses,
    participant,
    setParticipant,
    invitedParticipants,
    organizerParticipant,
    isDesktop,
  };
  return <VoteContext.Provider value={value}>{children} </VoteContext.Provider>;
}
