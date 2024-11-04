import { EventService } from "@/core/services/EventService";
import { getSession } from "@/utils/getSession";
import { NextRequest } from "next/server";
import { DELETE, POST } from "./route";

jest.mock("@/utils/getSession", () => ({
  ...jest.requireActual("@/utils/auth"),
  getSession: jest.fn().mockResolvedValue({ user: { id: 69 } }),
}));

jest.mock("@/core/services/EventService", () => ({
  EventService: jest.fn().mockImplementation(() => ({
    cancelAttendee: jest.fn(),
  })),
}));

describe("/api/events/[id]/attend", () => {
  describe("DELETE", () => {
    it("returns 200 status code on successful attendee cancellation", async () => {
      const response = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: "1" }),
      });
      expect(response.status).toEqual(200);
    });

    it("returns 401 status code if user is not authenticated", async () => {
      (getSession as jest.Mock).mockResolvedValueOnce(null);
      const response = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: "1" }),
      });
      expect(response.status).toEqual(401);
    });

    it("returns 400 status code if event ID is invalid", async () => {
      const response = await DELETE({} as NextRequest, {
        params: Promise.resolve({ id: "invalid" }),
      });
      expect(response.status).toEqual(400);
    });
  });
});
describe("POST", () => {
  it("returns 200 status code on successful attendee registration", async () => {
    const registerAttendeeMock = jest.fn().mockResolvedValue(undefined);
    (EventService as jest.Mock).mockImplementation(() => ({
      registerAttendee: registerAttendeeMock,
    }));
    const response = await POST({} as NextRequest, {
      params: Promise.resolve({ id: "1" }),
    });
    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual({
      message: "Attendee registered successfully",
    });
    expect(registerAttendeeMock).toHaveBeenCalledWith(1, expect.any(Number));
  });
  it("returns 401 status code if user is not authenticated", async () => {
    (getSession as jest.Mock).mockResolvedValueOnce(null);
    const response = await POST({} as NextRequest, {
      params: Promise.resolve({ id: "1" }),
    });
    expect(response.status).toEqual(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });
  it("returns 400 status code if event ID is invalid", async () => {
    const response = await POST({} as NextRequest, {
      params: Promise.resolve({ id: "invalid" }),
    });
    expect(response.status).toEqual(400);
    expect(await response.json()).toEqual({ error: "Invalid event ID" });
  });
  it("returns 500 status code on error during attendee registration", async () => {
    const registerAttendeeMock = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));
    (EventService as jest.Mock).mockImplementation(() => ({
      registerAttendee: registerAttendeeMock,
    }));
    const response = await POST({} as NextRequest, {
      params: Promise.resolve({ id: "1" }),
    });
    expect(response.status).toEqual(500);
    expect(await response.json()).toEqual({
      error: "Failed to register attendee",
    });
  });
});
