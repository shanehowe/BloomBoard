import "@testing-library/jest-dom";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CreateEventDialog } from "./createEventDialog";

jest.mock('../ui/datePicker', () => ({
  DatePicker: ({ date, setDate }: { date: Date, setDate: (date: Date) => void }) => (
    <input
      type="date"
      value={date ? date.toISOString().split("T")[0] : ''}
      onChange={(e) => setDate(new Date(e.target.value))}
    />
  ),
}));

describe("CreateEventDialog", () => {
  it("renders", () => {
    render(<CreateEventDialog onCreate={() => null} />);
    fireEvent.click(screen.getByText("Create Event"));
    const heading = screen.getByText("Create a new event");
    expect(heading).toBeInTheDocument();
  });

  it("calls onCreate when the create button is clicked and all fields are full", async () => {
    const onCreate = jest.fn();
    render(<CreateEventDialog onCreate={onCreate} />);
    fireEvent.click(screen.getByText("Create Event"));

    fireEvent.change(screen.getByLabelText("Event Title"), { target: { value: "My Event" } });

    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "This is a test event." } });

    fireEvent.change(screen.getByLabelText("Max Attendees"), { target: { value: "10" } });

    fireEvent.change(screen.getByLabelText("Location"), { target: { value: "Test Location" } });

    const createButton = screen.getByText("Create");

    await act(async () => {
      fireEvent.click(createButton);
    });

    waitFor(() => {
      expect(onCreate).toHaveBeenCalled();
    });
  });

  it("does not call onCreate when the create button is clicked and a fields are empty", async () => {
    const onCreate = jest.fn();
    render(<CreateEventDialog onCreate={onCreate} />);

    fireEvent.click(screen.getByText("Create Event"));
    const createButton = screen.getByText("Create");

    await act(async () => {
      fireEvent.click(createButton);
    });

    waitFor(() => {
      expect(onCreate).not.toHaveBeenCalled();
    });
  });
});
