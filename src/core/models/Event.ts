import { IEvent } from "@/core/interfaces/IEvent";

export class EventModel implements IEvent {
  id: number;
  userId: number;
  title: string;
  description: string;
  date: Date;
  county: string;
  maxAttendees: number;
  imageUrl: string | undefined;

  constructor(
    id: number,
    userId: number,
    title: string,
    description: string,
    date: Date,
    county: string,
    maxAttendees: number,
    imageUrl?: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.date = date;
    this.county = county;
    this.maxAttendees = maxAttendees;
    this.imageUrl = imageUrl;
  }
}
