import "@testing-library/jest-dom";
import { EventService } from "@/core/services/EventService";
import { EventDTO } from "../interfaces/IEvent";

describe("Event Service", () => {
  const create = jest.fn();
  const eventService = new EventService({
    findAll: jest.fn().mockReturnValue([]),
    create,
  });

  it("should retrieve all events", async () => {
    const events = await eventService.listEventsByCounty("Test County");
    expect(Array.isArray(events)).toBe(true);
  });

  it("should create an event", async () => {
    await eventService.create({
      title: "Test Event",
      description: "Test Description",
      date: new Date(),
      county: "Test County",
      maxAttendees: 10,
      userId: 69,
    });
    expect(create).toHaveBeenCalled();
  });

  it("should throw an error if the event is not valid", async () => {
    // As any is used to bypass the type checking
    await expect(
      eventService.create({
        title: "Test Event",
        description: "Test Description",
        date: new Date(),
        county: "Test County",
      } as unknown as EventDTO),
    ).rejects.toThrow();
  });
});
