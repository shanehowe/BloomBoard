import { EventRepo } from "@/core/repositories/EventRepo";
import { EventDTO } from "../interfaces/IEvent";

export class EventService {
  constructor(private eventRepo: EventRepo) {}

  async findEventsNotCreatedByUserId(userId: string) {
    return this.eventRepo.findAll(userId);
  }

  async create(event: EventDTO) {
    this.validateEvent(event);
    return await this.eventRepo.create(event);
  }

  async cancelAttendee(eventId: number, userId: number) {
    return await this.eventRepo.cancelAttendee(eventId, userId);
  }

  async findUserAttendingEvents(userId: number) {
    return await this.eventRepo.findUserAttendingEvents(userId);
  }

  private validateEvent(event: EventDTO) {
    if (
      !event.title ||
      !event.description ||
      !event.date ||
      !event.county ||
      !event.maxAttendees
    ) {
      throw new Error("Missing required fields");
    }
  }
}
