import { Timestamp } from "./base.type";

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: Timestamp;
}
