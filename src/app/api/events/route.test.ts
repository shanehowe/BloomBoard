import { EventService } from "@/core/services/EventService";
import { IEvent } from "@/core/interfaces/IEvent";
import { GET } from "@/app/api/events/route";
import { NextRequest } from "next/server";

jest.mock("../../../core/services/EventService");

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, { status }) => ({
      json: jest.fn().mockResolvedValue(data),
      status,
    })),
  },
}));

describe("GET /api/events", () => {
  it("should return 200 and a list of events on a successful service call", async () => {
    const mockEvents: IEvent[] = [
      {
        id: 1,
        userId: 101,
        title: "Test Event",
        description: "This is a test",
        date: new Date(),
        county: "Test Location",
        maxAttendees: 100,
        imageUrl: "http://example.com/image.png",
      },
    ];

    (
      EventService.prototype.findEventsNotCreatedByUserId as jest.Mock
    ).mockResolvedValue(mockEvents);

    const results = await GET({
      url: "http://localhost:3000/api/events?userId=1",
    } as NextRequest);
    const jsonResults = await results.json();

    expect(results.status).toBe(200);
    expect(jsonResults).toEqual(mockEvents);
  });

  it("should return 500 on service failure", async () => {
    (
      EventService.prototype.findEventsNotCreatedByUserId as jest.Mock
    ).mockRejectedValue(new Error("Service error"));

    const result = await GET({
      url: "http://localhost:3000/api/events?userId=1",
    } as NextRequest);
    const jsonResult = await result.json();

    expect(result.status).toBe(500);
    expect(jsonResult).toEqual({ error: "Failed to fetch events" });
  });

  it("should call EventService.listByCounty with the correct county", async () => {
    (
      EventService.prototype.findEventsNotCreatedByUserId as jest.Mock
    ).mockResolvedValue([]);
    const userId = "1";

    await GET({
      url: `http://localhost:3000/api/events?userId=${userId}`,
    } as NextRequest);

    expect(
      EventService.prototype.findEventsNotCreatedByUserId,
    ).toHaveBeenCalledWith(userId);
  });
});
