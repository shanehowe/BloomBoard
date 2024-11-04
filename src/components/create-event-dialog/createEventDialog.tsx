"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { counties } from "@/utils/counties";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DatePicker } from "../ui/datePicker";
import { useState } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";

interface CreateEventDialogProps {
  onCreate: (
    eventDetails: CreateEventDetails,
    image: File | null,
  ) => Promise<void>;
  message?: string | null;
  loading?: boolean;
}

export interface CreateEventDetails {
  title: string;
  description: string;
  date: Date | undefined;
  county: string;
  maxAttendees: number;
  imageUrl?: string | null;
}

const initialState: CreateEventDetails = {
  title: "",
  description: "",
  date: undefined,
  county: "",
  maxAttendees: 0,
  imageUrl: null,
};

export const CreateEventDialog = ({
  onCreate,
  loading,
  message,
}: CreateEventDialogProps) => {
  const [eventDetails, setEventDetails] =
    useState<CreateEventDetails>(initialState);
  const [image, setImage] = useState<File | null>(null);

  const handleEventTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEventDetails({ ...eventDetails, title: event.target.value });
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEventDetails({ ...eventDetails, description: event.target.value });
  };

  const handleDateChange = (date: Date | undefined) => {
    setEventDetails({ ...eventDetails, date });
  };

  const handleLocationChange = (county: string) => {
    setEventDetails({ ...eventDetails, county });
  };

  const handleMaxAttendeesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const maxAttendees = parseInt(event.target.value);
    setEventDetails({ ...eventDetails, maxAttendees });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const formHasEmptyFields = () => {
    const isDigit = /^\d+$/;
    if (!isDigit.test(eventDetails.maxAttendees.toString())) {
      return true;
    }
    return Object.values(eventDetails).some(
      (value) => value === undefined || value === "",
    );
  };

  const handleCreate = async () => {
    await onCreate(eventDetails, image);
    setEventDetails(initialState);
  };

  const buttonIsDisabled = formHasEmptyFields();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new event</DialogTitle>
          <DialogDescription>
            Create a new event to share with your friends.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <CreateEventLoadingSpinner message={message} />
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-title" className="text-right">
                  Event Title
                </Label>
                <Input
                  id="event-title"
                  className="col-span-3"
                  value={eventDetails.title}
                  onChange={handleEventTitleChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="event-description"
                  className="col-span-3"
                  value={eventDetails.description}
                  onChange={handleDescriptionChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="calendar" className="text-right">
                  Date
                </Label>
                <DatePicker
                  date={eventDetails.date}
                  setDate={handleDateChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-location" className="text-right">
                  Location
                </Label>
                <Select onValueChange={handleLocationChange}>
                  <SelectTrigger
                    className="col-span-3"
                    id="event-location"
                    data-testid="event-location"
                  >
                    <SelectValue placeholder="Counties" />
                  </SelectTrigger>
                  <SelectContent>
                    {counties.map((county) => (
                      <SelectItem value={county} key={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="event-max-attendees">
                  Max Attendees
                </Label>
                <Input
                  id="event-max-attendees"
                  type="number"
                  className="col-span-3"
                  onChange={handleMaxAttendeesChange}
                  value={eventDetails.maxAttendees}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="event-image">
                  Image (optional)
                </Label>
                <Input
                  id="event-image"
                  className="col-span-3"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreate}
                disabled={buttonIsDisabled}
              >
                Create
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface CreateEventLoadingSpinnerProps {
  message: string | null | undefined;
}

const CreateEventLoadingSpinner = ({
  message,
}: CreateEventLoadingSpinnerProps): React.ReactNode => {
  const messageToShow = message ?? "Creating event...";
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="text-center">
        <p>{messageToShow}</p>
        <p className="text-sm text-gray-500">This may take a few seconds</p>
      </div>
      <LoadingSpinner size={35} className="mt-5" />
    </div>
  );
};
