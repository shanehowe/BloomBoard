import { EventRepo } from "@/core/repositories/EventRepo";
import { EventDTO } from "../interfaces/IEvent";

export class EventService {
  constructor(private eventRepo: EventRepo) {}

  async listEventsByCounty(county: string) {
    return this.eventRepo.findAll(county);
  }

  async create(event: EventDTO) {
    this.validateEvent(event);
    return await this.eventRepo.create(event);
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
