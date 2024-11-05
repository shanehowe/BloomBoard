import { useEventFeed } from "@/components/EventsProvider";
import { httpClient } from "@/utils/httpClient";
import { useState } from "react";

interface UseAttendEventReturn {
  registerForEvent: (eventId: number) => Promise<void>;
  cancelAttendance: (eventId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useAttendEvent(): UseAttendEventReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { filterEvents } = useEventFeed();

  const registerForEvent = async (eventId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.post<{ message: string }, undefined>(
        `/events/${eventId}/attend`,
        undefined,
      );
      if (response.status === 200) {
        filterEvents(eventId);
      } else {
        setError("Failed to register for event");
      }
    } catch (err) {
      setError("Failed to register for event");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelAttendance = async (eventId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.delete<{ message: string }>(
        `/events/${eventId}/attend`,
      );
      if (response.status === 200) {
        filterEvents(eventId);
      } else {
        setError("Failed to cancel attendance");
      }
    } catch (err) {
      setError("Failed to cancel attendance");
      console.error("Cancellation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { registerForEvent, cancelAttendance, loading, error };
}
