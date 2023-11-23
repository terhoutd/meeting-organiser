import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import React from "react";
import { db } from "./firebase";
import { ParticipantFullInfo, TimesResponse } from "./Types";
import moment from "moment";
import { ROOT_DOC_NAME } from "./Constants";

export async function uploadParticipantInfo(pollId: string, participant: ParticipantFullInfo, participantId?: string) {
  console.log("hi2 from helper");
  try {
    const pollDocRef = doc(db, ROOT_DOC_NAME, pollId);
    if (participantId) {
      const participantRef = await addDoc(collection(pollDocRef, "participants"), participant);
      return participantRef.id;
    } else {
      await setDoc(doc(pollDocRef, "participants", participant.email), participant);
      return participantId;
    }
  } catch (e) {
    console.error("Error setting document: ", e);
  }
}

export async function fetchData(pollId: string) {
  //generates a doc reference then uses it to obtain the actual doc
  const pollDocRef = doc(db, "group polls", pollId);
  const pollDocSnap = await getDoc(pollDocRef);
  if (!pollDocSnap.exists()) {
    console.log("No such document!");
    return;
  }
  const pollDataSnap = pollDocSnap.data() as PollData;
  console.log("Document data:", pollDataSnap);
  //get all the docs in the participants collection and their data to our object
  const votesDocsSnaps = await getDocs(collection(pollDocRef, "participants"));
  pollDataSnap.participants = votesDocsSnaps.docs.map((v) => {
    return { id: v.id, ...v.data() } as ParticipantFullInfo;
  });
  pollDataSnap.slots.sort((a, b) => {
    if (a.start.toDate() < b.start.toDate()) return -1;
    if (a.start.toDate() > b.start.toDate()) return 1;
    return 0;
  });
  return pollDataSnap;
}
export function getDateDetails(startDate, endDate) {
  return {
    day: moment(startDate).format("ddd"),
    date: startDate.getDate(),
    month: moment(startDate).format("MMM"),
    startTime: moment(startDate).format("h:mm a"),
    endTime: moment(endDate).format("h:mm a"),
  };
}
