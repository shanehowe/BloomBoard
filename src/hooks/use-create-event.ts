import { CreateEventDetails } from "@/components/create-event-dialog/createEventDialog";
import { IEvent } from "@/core/interfaces/IEvent";
import { httpClient } from "@/utils/httpClient";
import { useState } from "react";

export const useCreateEvent = () => {
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (eventDetails: CreateEventDetails) => {
    setError(null);
    try {
      const result = await httpClient.post<IEvent, CreateEventDetails>(
        "/events",
        eventDetails,
      );
      if (result.status === 500) {
        setError("Failed to create event");
        return null;
      }
      return result.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Failed to create event");
    }
  };

  return { error, createEvent };
};
