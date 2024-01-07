import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import React from "react";
import { db } from "./firebase";
import { DurationObject, ParticipantFullInfo, PollData, TimesResponse } from "./Types";
import moment from "moment";
import { ROOT_DOC_NAME } from "./Constants";

export async function uploadParticipantInfo(
  pollId: string,
  participant: ParticipantFullInfo,
  participantId?: string
) {
  console.log("hi2 from helper");
  try {
    const pollDocRef = doc(db, ROOT_DOC_NAME, pollId);
    if (!participantId) {
      const participantRef = await addDoc(collection(pollDocRef, "participants"), participant);
      return participantRef.id;
    } else {
      await setDoc(doc(pollDocRef, "participants", participantId), participant, { merge: true });
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
export function getDateDetails(startDate: Date, endDate: Date) {
  const obj = {
    day: moment(startDate).format("ddd"),
    date: startDate.getDate(),
    month: moment(startDate).format("MMM"),
    startTime: moment(startDate).format("h:mm a"),
    endTime: moment(endDate).format("h:mm a"),
    isAllDay: false, // Add the isAllDay property and set it to false by default
  };
  obj.isAllDay = obj.startTime === "12:00 am" && obj.endTime === "12:00 am";
  return obj;
}

export const durationsDetails: DurationObject[] = [
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
  {
    title: "All day",
    duration: "all day",
  },
];
export const getDurationTitle = (duration: number | "all day") => {
  return durationsDetails.find((d) => d.duration === duration)?.title;
};
//find index of array based on duration
// export const findIndexByDuration = (duration: number | "all day") => {
//   return durationsDetails.findIndex((d) => d.duration === duration);
// };
