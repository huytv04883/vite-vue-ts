import { Timestamp } from './base.type';

export interface Group {
  id: string;
  members: string[];
  createdAt: Timestamp;
  createBy: string;
  name: string;
}
