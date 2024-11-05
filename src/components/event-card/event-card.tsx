"use client";
import React from "react";
import { IEvent } from "@/core/interfaces/IEvent";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Check } from "lucide-react";

interface EventCardProps {
  event: IEvent;
  handleButtonClick: (eventId: number) => void | Promise<void>;
  loading?: boolean;
}

export const EventCard = ({ event, handleButtonClick }: EventCardProps) => {
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async (eventId: number) => {
    setLoading(true);
    await handleButtonClick(eventId);
    setLoading(false);
  };

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-2">{event.description}</p>
        {event.imageUrl && (
          <div className="relative h-80 rounded-lg">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="rounded-lg"
            />
          </div>
        )}
        <Badge className="mr-2 mt-2 py-1 px-3">County {event.county}</Badge>
        <Badge className="mr-2 py-1 px-3">
          {new Date(event.date).toDateString()}
        </Badge>
        <Badge className="mr-2 py-1 px-3">{event.maxAttendees} attendees</Badge>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => handleRegister(event.id)}
          disabled={loading}
        >
          <Check size={16} className="mr-2" />
          {loading ? "Registering..." : "Register"}
        </Button>
      </CardFooter>
    </Card>
  );
};
