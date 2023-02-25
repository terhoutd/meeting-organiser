import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import React from "react";
import { db } from "./firebase";
import { ParticipantFullInfo, TimesResponse } from "./Types";

export async function setParticipantInfo(pollId: string, participant: ParticipantFullInfo) {
  console.log("hi2 from helper");

  //if (!participant || !pollId) return;
  try {
    const pollDocRef = doc(db, "group polls", pollId);
    await setDoc(doc(pollDocRef, "participants", participant.email), participant);
  } catch (e) {
    console.error("Error setting document: ", e);
  }
}
export async function getPollData(pollId: string) {
  const pollRef = doc(db, "group polls", pollId);
  const pollSnap = await getDoc(pollRef);
  const participantsSnap = await getDocs(collection(pollRef, "participants"));
  console.log("participantsSnap ", participantsSnap);

  if (pollSnap.exists()) {
    console.log("Document data:", pollSnap.data());
    return [pollSnap.data(), participantsSnap.data()];
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}
