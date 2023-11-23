import { Timestamp } from "firebase/firestore";
import { IFNEEDBE_VOTE, NO_VOTE, YES_VOTE } from "./Constants";

export type CalEvent = { start: Date; end: Date; title: string; id: string };
export type FsSlot = { start: Timestamp; end: Timestamp; title: string; id: number };
export type TimesResponse = {
  id: number;
  response: responseOption;
};
export type responseOption = typeof YES_VOTE | typeof NO_VOTE | typeof IFNEEDBE_VOTE;
export type PollData = {
  organiserEmail: string;
  organiserName: string;
  title: string;
  slots: FsSlot[];
  participants: ParticipantFullInfo[];
};
export interface Participant {
  name: string;
  email: string;
  isOrganiser?: boolean;
}
export interface ParticipantFullInfo extends Participant {
  responses: TimesResponse[];
  id: string;
}
