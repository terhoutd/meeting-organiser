import { Timestamp } from "firebase/firestore";
import { IFNEEDBE_VOTE, NO_VOTE, YES_VOTE } from "./Constants";
import { Event } from "react-big-calendar";

export interface ExtendedEvent extends Event {
  id: string;
  duration: Duration;
}
// export interface firebaseEvent {
//   allDay?: boolean | undefined;
//   title?: React.ReactNode | undefined;
//   start?: any;
//   end?: any;
//   id: string;
//   duration: Duration;
// }
export type FsSlot = {
  start: Timestamp;
  end: Timestamp;
  title: string;
  id: string;
  duration: Duration;
};
export type TimesResponse = {
  id: string;
  response: responseOption;
};
export type responseOption = typeof YES_VOTE | typeof NO_VOTE | typeof IFNEEDBE_VOTE;
export type PollData = {
  organiserEmail: string;
  organiserName: string;
  title: string;
  location: string;
  description: string;
  slots: FsSlot[];
  participants: ParticipantFullInfo[];
  duration: any;
};
export interface Participant {
  name: string;
  email: string;
  isOrganiser?: boolean;
}
export interface ParticipantFullInfo extends Participant {
  responses: TimesResponse[];
  id?: string;
}
export type DurationObject = {
  duration: Duration;
  title: string;
};

export type Duration = number | "all day";
