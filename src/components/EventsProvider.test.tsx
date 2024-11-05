import React from "react";
import { render, waitFor } from "@testing-library/react";
import {
  EventsContextValue,
  EventsProvider,
  useEventFeed,
} from "./EventsProvider";
import { httpClient } from "@/utils/httpClient";
import { useSession } from "next-auth/react";
import { IEvent } from "@/core/interfaces/IEvent";

jest.mock("next-auth/react");
jest.mock("@/utils/httpClient");

const mockEvents: IEvent[] = [
  {
    id: 1,
    title: "Event 1",
    description: "Description 1",
    date: new Date(),
    maxAttendees: 10,
    county: "Test",
    userId: 1,
  },
  {
    id: 2,
    title: "Event 2",
    description: "Description 2",
    date: new Date(),
    maxAttendees: 10,
    county: "Test",
    userId: 1,
  },
];

describe("EventsProvider", () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: "user1" } },
    });
    (httpClient.get as jest.Mock).mockResolvedValue({ data: mockEvents });
  });

  it("provides the correct context values", async () => {
    let contextValue: EventsContextValue;

    const TestComponent = () => {
      contextValue = useEventFeed();
      return null;
    };

    render(
      <EventsProvider>
        <TestComponent />
      </EventsProvider>,
    );

    await waitFor(() => {
      expect(contextValue.events).toEqual(mockEvents);
      expect(contextValue.isLoading).toBe(false);
      expect(contextValue.error).toBe(null);
      expect(typeof contextValue.fetchEvents).toBe("function");
      expect(typeof contextValue.filterEvents).toBe("function");
    });
  });

  it("fetches events on mount", async () => {
    render(
      <EventsProvider>
        <div />
      </EventsProvider>,
    );

    await waitFor(() => {
      expect(httpClient.get).toHaveBeenCalledWith("/events?userId=user1");
    });
  });

  it("filters events correctly", async () => {
    let contextValue: EventsContextValue;

    const TestComponent = () => {
      contextValue = useEventFeed();
      return null;
    };

    render(
      <EventsProvider>
        <TestComponent />
      </EventsProvider>,
    );

    await waitFor(() => {
      contextValue.filterEvents(1);
      expect(contextValue.events).toEqual([mockEvents[1]]);
    });
  });
});
