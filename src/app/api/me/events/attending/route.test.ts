import { NextRequest } from "next/server";
import { GET } from "./route";
import { getSession } from "@/utils/getSession";

jest.mock("@/utils/getSession", () => ({
  ...jest.requireActual("@/utils/getSession"),
  getSession: jest.fn().mockResolvedValue({ user: { id: 123 } }),
}));

jest.mock("@/core/services/EventService", () => ({
  EventService: jest.fn().mockImplementation(() => ({
    findUserAttendingEvents: jest.fn().mockResolvedValue([]),
  })),
}));

describe("api/me/events/attending", () => {
  describe("GET", () => {
    it("returns 200 status code on successful fetching of attending events", async () => {
      const response = await GET({} as NextRequest);
      expect(response.status).toEqual(200);
    });

    it("returns 401 status code when session is null", async () => {
      (getSession as jest.Mock).mockResolvedValueOnce(null);
      const request = new NextRequest(new URL("http://localhost"));
      const response = await GET(request);
      expect(response.status).toEqual(401);
    });
  });
});
