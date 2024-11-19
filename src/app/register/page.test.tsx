/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterPage from "./page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      refresh: jest.fn(),
    };
  },
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    render(<RegisterPage />);
  });

  it("renders without crashing", () => {
    expect(
      screen.getByRole("heading", { name: "Register" })
    ).toBeInTheDocument();
  });

  it("displays form elements", () => {
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();
  });

  it("validates empty fields", async () => {
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(
        screen.getByText(/must be at least 3 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("validates username length", async () => {
    const usernameInput = screen.getByPlaceholderText("Username");

    fireEvent.change(usernameInput, { target: { value: "ab" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(
        screen.getByText(/must be at least 3 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("validates password length", async () => {
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(
        screen.getByText(/must be at least 8 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("validates password uppercase requirement", async () => {
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(
        screen.getByText(/must contain at least one uppercase letter/i)
      ).toBeInTheDocument();
    });
  });

  it("validates form with valid data", async () => {
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    // Wait for form submission - no validation errors should be present
    await waitFor(() => {
      expect(screen.queryByText(/must be at least/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/please enter a valid email/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/must contain at least/i)
      ).not.toBeInTheDocument();
    });
  });
});
