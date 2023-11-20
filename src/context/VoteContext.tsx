import { doc, setDoc } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import usePollData from "../hooks/usePollData";
import { db } from "../others/firebase";
import { TimesResponse, Participant, PollData } from "../others/Types";
import { useLocation } from "react-router-dom";

import { getDoc, getDocs, collection } from "firebase/firestore";
import { FsSlot, ParticipantFullInfo } from "../others/Types";
import { fetchData } from "../others/helpers";

const VoteContext = React.createContext({});
export function useVote(): any {
  return useContext(VoteContext);
}

export function VoteProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [pollId, setPollId] = useState<string>();
  const [pageType, setPageType] = useState<string>();
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

  //get the data synced with current pollid
  useEffect(() => {
    console.log("location is", location);
    if (!pollId || !location) return;
    fetchData(pollId).then((data) => {
      if (data) setPollData(data);
    }); //TO DO need to handle errors
  }, [pollId, location]);

  const value = {
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
    pageType,
    setPageType,
  };
  return <VoteContext.Provider value={value}>{children} </VoteContext.Provider>;
}
