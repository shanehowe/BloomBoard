import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "./page";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Mock UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: CardProps) => (
    <div className={className}>{children}</div>
  ),
  CardHeader: ({ children }: CardProps) => <div>{children}</div>,
  CardTitle: ({ children }: CardProps) => <div>{children}</div>,
  CardContent: ({ children }: CardProps) => <div>{children}</div>,
  CardFooter: ({ children }: CardProps) => <div>{children}</div>,
}));

// Mock next-auth and router
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders login form elements", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

    await act(async () => {
      render(<LoginPage />);
    });

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const form = screen.getByRole("button").closest("form")!;

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.submit(form);
    });

    expect(signIn).toHaveBeenCalledWith("credentials", {
      username: "testuser",
      password: "password123",
      action: "login",
      redirect: false,
    });

    expect(mockRouter.push).toHaveBeenCalledWith("/feed");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("shows error for empty fields", async () => {
    await act(async () => {
      render(<LoginPage />);
    });

    const form = screen.getByRole("button").closest("form")!;

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(screen.getByText("Please fill all fields")).toBeInTheDocument();
  });
});
