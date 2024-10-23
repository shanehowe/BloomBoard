export interface IEvent {
  id: number;
  userId: number;
  title: string;
  description: string;
  date: Date;
  county: string;
  maxAttendees: number;
  imageUrl?: string;
}

export type EventDTO = Omit<IEvent, "id">;
