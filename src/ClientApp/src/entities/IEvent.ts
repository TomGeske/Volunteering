import { IBoundary } from './IBoundary'
import { IRegistrations } from './IRegistrations'

export interface IEvent {
  id: string;
  name: string;
  company: string;
  ownerName1: string;
  ownerName2: string;
  ownerEmail: string;
  department: string;
  country: string;
  eventLocation: string;
  eventdate: Date;
  eventEndDate: Date;
  startEventTime: string;
  url: string;
  description: string;
  eventType: string;
  registrations: IRegistrations[];
  boundary: IBoundary;
}
