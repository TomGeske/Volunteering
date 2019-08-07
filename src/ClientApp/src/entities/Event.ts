import { Registration } from './Registration'

export interface Event {
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
  endEventTime: string;
  url: string;
  description: string;
  eventType: string;
  mediaLink: string;
  registrations: Registration[];
  coordinates: EventCoordinates;
  pushpins: PushPin[];
}

export interface EventCoordinates {
  latitude: number;
  longitude: number;
}

export interface PushPin {
  location: number[];
  option: PushPinOption;
}

export interface PushPinOption {
  color: string;
}
