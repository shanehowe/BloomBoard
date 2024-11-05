"use client";

import { IEvent } from "@/core/interfaces/IEvent";
import { httpClient } from "@/utils/httpClient";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface EventsProviderProps {
  children: ReactNode;
}

export interface EventsContextValue {
  events: IEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  filterEvents: (eventId: number) => void;
}

const EventsContext = createContext<EventsContextValue>({
  events: [],
  isLoading: true,
  error: null,
  fetchEvents: () => Promise.resolve(),
  filterEvents: () => {},
});

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();

  const fetchEvents = async () => {
    if (!session.data) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await httpClient.get<IEvent[]>(
        `/events?userId=${session.data.user.id}`,
      );
      setEvents(response.data);
    } catch (error) {
      setError(String(error));
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = (eventId: number) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  useEffect(() => {
    fetchEvents();
  }, [session]);

  const contextValue = {
    events,
    isLoading,
    error,
    fetchEvents,
    filterEvents,
  };

  return (
    <EventsContext.Provider value={contextValue}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEventFeed = () => {
  return useContext(EventsContext);
};
