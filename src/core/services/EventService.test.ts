import { EventService } from "@/core/services/EventService";
import "@testing-library/jest-dom";
import { EventDTO } from "../interfaces/IEvent";

describe("Event Service", () => {
  const create = jest.fn();
  const cancelAttendee = jest.fn();
  const registerAttendee = jest.fn();
  const findUserAttendingEvents = jest.fn().mockReturnValue([]);
  const eventService = new EventService({
    findAll: jest.fn().mockReturnValue([]),
    create,
    cancelAttendee,
    findUserAttendingEvents,
    registerAttendee,
  });

  it("should retrieve all events", async () => {
    const events =
      await eventService.findEventsNotCreatedByUserId("Test County");
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

  it("should cancel an attendee", async () => {
    await eventService.cancelAttendee(1, 69);
    expect(cancelAttendee).toHaveBeenCalled();
  });

  it("should register an attendee for the event", async () => {
    await eventService.registerAttendee(1, 69);
    expect(registerAttendee).toHaveBeenCalled();
  });

  it("should retrieve all events a user is attending", async () => {
    const events = await eventService.findUserAttendingEvents(69);
    expect(Array.isArray(events)).toBe(true);
    expect(findUserAttendingEvents).toHaveBeenCalled();
  });
});
