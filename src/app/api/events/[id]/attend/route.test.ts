import { NextRequest } from "next/server";
import { DELETE } from "./route";
import { getSession } from "@/utils/getSession";

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
