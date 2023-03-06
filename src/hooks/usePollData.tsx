import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../others/firebase";
import { FsSlot, PollData, ParticipantFullInfo } from "../others/Types";

export default function usePollData(pollId: string) {
  const [pollData, setPollData] = useState<PollData>();
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
      if (callback) callback(pollData);
    }
    fetchData();
  }, [pollId]);
  return pollData;
}
