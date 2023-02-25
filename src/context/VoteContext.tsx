import { doc, setDoc } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { db } from "../others/firebase";
import { TimesResponse, Participant } from "../others/Types";

const VoteContext = React.createContext({});
export function UseVote() {
  return useContext(VoteContext);
}

export function VoteProvider({ children }: { children: ReactNode }) {
  const [pollId, setPollId] = useState<string>("");
  const [participant, setParticipant] = useState<Participant>();

  const value = {
    test: "hello1",
  };
  return <VoteContext.Provider value={value}>{children} </VoteContext.Provider>;
}
