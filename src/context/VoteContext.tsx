import { doc, setDoc } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { db } from "../others/firebase";
import { TimesResponse, Participant, PollData } from "../others/Types";
import { useLocation } from "react-router-dom";

import { getDoc, getDocs, collection } from "firebase/firestore";
import { FsSlot, ParticipantFullInfo } from "../others/Types";
import { fetchData } from "../others/helpers";
import { useCookies } from "react-cookie";
import { COOKIE_NAME_PARTICIPANT_ID } from "../others/Constants";

type VoteContextType = {
  pollData?: PollData;
  setPollData: (data: PollData) => void;
  setPollId: (id: string) => void;
  userResponses?: TimesResponse[];
  setUserResponses: (responses: TimesResponse[]) => void;
  participant?: Participant;
  setParticipant: (participant: Participant) => void;
  pageType?: string;
  setPageType: (pageType: string) => void;
  participantIdFromCookie?: string;
  setParticipantIdCookie: (name: string, value: string, options?: any) => void;
  isPollCreated: boolean;
  setIsPollCreated: (x: boolean) => void;
  isVoting: boolean;
  setIsVoting: (x: boolean) => void;
  invitedParticipants?: Participant[];
  organizerParticipant?: Participant;
  isDesktop: boolean;
  isPageReadOnly: boolean;
};
const VoteContext = React.createContext<VoteContextType | undefined>(undefined);
export function useVote(): VoteContextType {
  const context = useContext(VoteContext);
  if (context === undefined) {
    throw new Error("useVote must be used within a VoteProvider");
  }
  return context;
}

export function VoteProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [pollId, setPollId] = useState<string>();
  const [pageType, setPageType] = useState<string>();
  const [pollData, setPollData] = useState<PollData>();
  const [userResponses, setUserResponses] = useState<TimesResponse[]>();
  const [participant, setParticipant] = useState<Participant>();
  const [sizeMode, setSizeMode] = useState<"desktop" | "mobile">(
    window.innerWidth >= 1024 ? "desktop" : "mobile"
  );
  const [isPollCreated, setIsPollCreated] = useState(false);
  const isDesktop = sizeMode === "desktop";
  const invitedParticipants = pollData?.participants.filter((p) => !p.isOrganiser);
  const organizerParticipant = pollData?.participants.find((p) => p.isOrganiser);
  const [cookies, setCookie] = useCookies([COOKIE_NAME_PARTICIPANT_ID]);
  const participantIdFromCookie = cookies[COOKIE_NAME_PARTICIPANT_ID];
  const [isVoting, setIsVoting] = useState(false);

  const isPageReadOnly = ["vote overview", "poll overview"].includes(pageType);

  console.log("setCookie", setCookie);
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

  //updates the participant based on cookie, when pollData is available
  useEffect(() => {
    if (!pollData || !cookies[COOKIE_NAME_PARTICIPANT_ID]) return;
    const foundParticipant = pollData.participants.find(
      (p) => p.id === cookies[COOKIE_NAME_PARTICIPANT_ID]
    );
    if (foundParticipant) setParticipant(foundParticipant);
  }, [pollData, participantIdFromCookie]);
  const value = {
    pollData,
    setPollData,
    setPollId,
    userResponses,
    setUserResponses,
    participant,
    setParticipant,
    pageType,
    setPageType,
    participantIdFromCookie,
    setParticipantIdCookie: setCookie,
    isPollCreated,
    setIsPollCreated,
    isVoting,
    setIsVoting,
    invitedParticipants,
    organizerParticipant,
    isDesktop,
    isPageReadOnly,
  };
  return <VoteContext.Provider value={value}>{children} </VoteContext.Provider>;
}
