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
import { Alert, AlertDescription } from "../ui/alert";

interface CreateEventDialogProps {
  onCreate: (eventDetails: CreateEventDetails) => void;
}

export interface CreateEventDetails {
  title: string;
  description: string;
  date: Date | undefined;
  location: string;
  maxAttendees: number;
}

const initialState: CreateEventDetails = {
  title: "",
  description: "",
  date: undefined,
  location: "",
  maxAttendees: 0,
};

export const CreateEventDialog = ({ onCreate }: CreateEventDialogProps) => {
  const [eventDetails, setEventDetails] =
    useState<CreateEventDetails>(initialState);
  const [error, setError] = useState<string | null>(null);

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
    setEventDetails({ ...eventDetails, location: county });
  };

  const handleMaxAttendeesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const maxAttendees = parseInt(event.target.value);
    if (event.target.value && isNaN(maxAttendees)) {
      dispatchTimedErrorMessage("Max attendees must be a number");
      return;
    }

    setEventDetails({ ...eventDetails, maxAttendees });
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

  const dispatchTimedErrorMessage = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleCreate = () => {
    if (formHasEmptyFields()) {
      dispatchTimedErrorMessage("Please fill out all fields");
      return;
    }
    onCreate(eventDetails);
    setEventDetails(initialState);
  };

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
          {error != null && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </DialogHeader>
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
            <DatePicker date={eventDetails.date} setDate={handleDateChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-location" className="text-right">
              Location
            </Label>
            <Select onValueChange={handleLocationChange}>
              <SelectTrigger className="col-span-3" id="event-location">
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
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreate}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
