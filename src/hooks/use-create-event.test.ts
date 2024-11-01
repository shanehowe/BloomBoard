import { renderHook, act, waitFor } from "@testing-library/react";
import { useCreateEvent } from "./use-create-event";
import { httpClient } from "@/utils/httpClient";
import { CreateEventDetails } from "@/components/create-event-dialog/createEventDialog";
import { IEvent } from "@/core/interfaces/IEvent";

jest.mock("@/utils/httpClient");

describe("useCreateEvent", () => {
  const mockEventDetails: CreateEventDetails = {
    title: "Test Event",
    date: new Date("2023-10-10"),
    county: "Test Location",
    maxAttendees: 10,
    description: "Test Description",
  };

  const mockEvent: IEvent = {
    id: 1,
    title: "Test Event",
    date: new Date("2023-10-10"),
    county: "Test Location",
    maxAttendees: 10,
    description: "Test Description",
    userId: 1,
  };

  it("should initialize with no error and not loading", () => {
    const { result } = renderHook(() => useCreateEvent());
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should set loading to true while creating event", async () => {
    (httpClient.post as jest.Mock).mockResolvedValue({ status: 200, data: mockEvent });

    const { result } = renderHook(() => useCreateEvent());

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.createEvent(mockEventDetails);
    });

    expect(result.current.error).toBeNull();
  });

  it("should set error if event creation fails", async () => {
    (httpClient.post as jest.Mock).mockRejectedValue(new Error("Failed to create event"));

    const { result } = renderHook(() => useCreateEvent());

    act(() => {
      result.current.createEvent(mockEventDetails);
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Failed to create event");
    });
    expect(result.current.loading).toBe(false);
  });

  it("should return event data if creation is successful", async () => {
    (httpClient.post as jest.Mock).mockResolvedValue({ status: 200, data: mockEvent });

    const { result } = renderHook(() => useCreateEvent());

    let createdEvent;
    await act(async () => {
      createdEvent = await result.current.createEvent(mockEventDetails);
    });

    expect(createdEvent).toEqual(mockEvent);
    expect(result.current.error).toBeNull();
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should set error if server returns 500 status", async () => {
    (httpClient.post as jest.Mock).mockResolvedValue({ status: 500 });

    const { result } = renderHook(() => useCreateEvent());

    await act(async () => {
      await result.current.createEvent(mockEventDetails);
    });

    expect(result.current.error).toBe("Failed to create event");
    expect(result.current.loading).toBe(false);
  });
});
