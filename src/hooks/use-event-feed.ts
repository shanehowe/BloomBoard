import { IEvent } from "@/core/interfaces/IEvent";
import { useEffect, useState } from "react";
import { httpClient } from "@/utils/httpClient";

export const useEventFeed = (userId: string) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await httpClient.get<IEvent[]>(
        "/events?userId=" + userId,
      );
      setEvents(response.data);
      console.log(response);
    } catch (error) {
      setError(String(error));
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchEvents();
  }, [userId]);

  return { events, isLoading, error, fetchEvents };
};
