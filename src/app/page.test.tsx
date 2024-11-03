/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./page";
import "@testing-library/jest-dom";
import { connectToDatabase } from "@/utils/db";

jest.mock("@/utils/db", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="next-image" />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders main content correctly", async () => {
    const page = await Home();
    render(page);

    expect(screen.getByText("Welcome to BloomBoard")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get started/i })).toHaveAttribute(
      "href",
      "/register"
    );
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("attempts database connection", async () => {
    await Home();
    expect(connectToDatabase).toHaveBeenCalled();
  });

  it("handles database connection error gracefully", async () => {
    (connectToDatabase as jest.Mock).mockRejectedValueOnce(
      new Error("Connection failed")
    );
    const page = await Home();
    render(page);
    expect(screen.getByText("Welcome to BloomBoard")).toBeInTheDocument();
  });
});
