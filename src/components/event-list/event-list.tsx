"use client";
import React from "react";
import { IEvent } from "@/core/interfaces/IEvent";
import { EventCard } from "../event-card/event-card";

export interface EventListProps {
  events: IEvent[];
}

export const EventList = ({ events }: EventListProps) => {
  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">No events found</p>
      </div>
    );
  }

  return (
    <>
      {events.map((event) => (
        <EventCard key={event.id} event={event} handleRegister={() => null} />
      ))}
    </>
  );
};
