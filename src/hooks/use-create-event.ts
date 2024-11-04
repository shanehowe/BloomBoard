import { ImageUploadResponse } from "@/app/api/image/upload/route";
import { CreateEventDetails } from "@/components/create-event-dialog/createEventDialog";
import { IEvent } from "@/core/interfaces/IEvent";
import { httpClient } from "@/utils/httpClient";
import { useState } from "react";

type ImageFile = File | null | undefined;

export const useCreateEvent = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  async function uploadEventImage(image: ImageFile) {
    if (image) {
      setLoadingMessage("Uploading image...");
      const formData = new FormData();
      formData.append("file", image);
      const response = await httpClient.post<ImageUploadResponse, FormData>(
        "/image/upload",
        formData,
        {
          "Content-Type": "multipart/form-data",
        },
      );
      return response.data.imageUrl;
    }
  }

  const createEvent = async (
    eventDetails: CreateEventDetails,
    image?: File | null,
  ) => {
    setError(null);
    setLoading(true);
    try {
      const imageUrl = await uploadEventImage(image);
      if (imageUrl) {
        eventDetails.imageUrl = imageUrl;
      }
      setLoadingMessage("Creating event...");
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
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };

  return { error, createEvent, loading, loadingMessage };
};
