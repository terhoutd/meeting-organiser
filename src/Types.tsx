import { Timestamp } from "firebase/firestore";
import { IFNEEDBE_VOTE, NO_VOTE, YES_VOTE } from "./Constants";

export type CalEvent = { start: Date; end: Date; title: String; id: Number };
export type FsCalEvent = { start: Timestamp; end: Timestamp; title: String; id: Number };
export type vote = {
  id: number;
  vote: VoteOption;
};
export type VoteOption = typeof YES_VOTE | typeof NO_VOTE | typeof IFNEEDBE_VOTE;
