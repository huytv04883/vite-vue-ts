import { DocumentChangeType } from "firebase/firestore";
import { Timestamp } from "./base.type";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp;
  reactions?: string[];
  type: DocumentChangeType;
}
