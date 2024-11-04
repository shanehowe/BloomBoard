import { httpClient } from "@/utils/httpClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UseAttendEventReturn {
  registerForEvent: () => Promise<void>;
  cancelAttendance: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useAttendEvent(eventId: number): UseAttendEventReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const registerForEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.post<{ message: string }, undefined>(
        `/api/events/${eventId}/attend`,
        undefined
      );
      if (response.status === 200) {
        router.refresh();
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

  const cancelAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.delete<{ message: string }>(
        `/api/events/${eventId}/attend`
      );
      if (response.status === 200) {
        router.refresh();
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
