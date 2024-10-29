import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventCard } from "./event-card";
import { IEvent } from "@/core/interfaces/IEvent";

describe("EventCard", () => {
  const mockEvent: IEvent = {
    id: 1,
    title: "Sample Event",
    description: "This is a sample event.",
    county: "Sample County",
    date: new Date("2023-10-10"),
    maxAttendees: 100,
    userId: 1,
  };

  const handleRegister = jest.fn();

  it("renders correctly", () => {
    render(<EventCard event={mockEvent} handleRegister={handleRegister} />);
    expect(screen.getByText("Sample Event")).toBeInTheDocument();
    expect(screen.getByText("This is a sample event.")).toBeInTheDocument();
    expect(screen.getByText("County Sample County")).toBeInTheDocument();
    expect(screen.getByText("Tue Oct 10 2023")).toBeInTheDocument();
    expect(screen.getByText("100 attendees")).toBeInTheDocument();
  });

  it("calls handleRegister when the Register button is clicked", () => {
    render(<EventCard event={mockEvent} handleRegister={handleRegister} />);
    fireEvent.click(screen.getByText("Register"));
    expect(handleRegister).toHaveBeenCalledWith(1);
  });
});
