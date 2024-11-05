"use client";
import React from "react";
import { IEvent } from "@/core/interfaces/IEvent";
import { EventCard } from "../event-card/event-card";
import { useAttendEvent } from "@/hooks/use-event-attend";
import { useToast } from "@/hooks/use-toast";

export interface EventListProps {
  events: IEvent[];
}

export const EventList = ({ events }: EventListProps) => {
  const { toast } = useToast();
  const { registerForEvent, error } = useAttendEvent();
  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">No events found</p>
      </div>
    );
  }

  const handleRegister = async (eventId: number) => {
    await registerForEvent(eventId);
    if (error) {
      toast({
        title: "Failed to register for event",
        description: "Please try again later",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "You have successfully registered for the event",
      });
    }
  };

  return (
    <>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          handleButtonClick={handleRegister}
        />
      ))}
    </>
  );
};
