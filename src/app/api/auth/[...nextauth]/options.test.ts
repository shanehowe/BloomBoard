import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/utils/db";
import { hashPassword } from "@/utils/auth";
import { registerUser, loginUser, authorize, authOptions } from "./options";
import type { AdapterUser } from "next-auth/adapters";
import type { Session } from "next-auth";

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("@/utils/db", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("@/utils/auth", () => ({
  hashPassword: jest.fn(),
}));

describe("Auth Functions", () => {
  const mockPool = {
    request: jest.fn().mockReturnThis(),
    input: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  const mockReq = {
    body: {},
    query: {},
    headers: {},
    method: "POST",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (connectToDatabase as jest.Mock).mockResolvedValue(mockPool);
    (hashPassword as jest.Mock).mockResolvedValue("hashedPassword123");
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockPool.request.mockReturnThis();
    mockPool.input.mockReturnThis();
  });

  describe("registerUser", () => {
    const validCredentials = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      action: "register",
    };

    it("successfully registers a new user", async () => {
      mockPool.query
        .mockResolvedValueOnce({ recordset: [] })
        .mockResolvedValueOnce({
          recordset: [
            {
              id: "1",
              username: "testuser",
              email: "test@example.com",
            },
          ],
        });

      const result = await registerUser(validCredentials);

      expect(result).toEqual({
        id: "1",
        username: "testuser",
        email: "test@example.com",
      });
      expect(hashPassword).toHaveBeenCalledWith("password123");
    });

    it("throws error if email is missing", async () => {
      await expect(
        registerUser({
          ...validCredentials,
          email: "",
        })
      ).rejects.toThrow("Email is required for registration");
    });

    it("throws error if user exists", async () => {
      mockPool.query.mockResolvedValueOnce({
        recordset: [{ username: "testuser" }],
      });

      await expect(registerUser(validCredentials)).rejects.toThrow(
        "Username or email already exists"
      );
    });
  });

  describe("loginUser", () => {
    const validCredentials = {
      username: "testuser",
      password: "password123",
      action: "login",
    };

    it("successfully logs in existing user", async () => {
      mockPool.query.mockResolvedValueOnce({
        recordset: [
          {
            id: "1",
            username: "testuser",
            email: "test@example.com",
            password: "hashedPassword123",
          },
        ],
      });

      const result = await loginUser(validCredentials);

      expect(result).toEqual({
        id: "1",
        username: "testuser",
        email: "test@example.com",
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword123"
      );
    });

    it("returns null for wrong password", async () => {
      mockPool.query.mockResolvedValueOnce({
        recordset: [
          {
            id: "1",
            username: "testuser",
            password: "hashedPassword123",
          },
        ],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await loginUser(validCredentials);
      expect(result).toBeNull();
    });

    it("returns null for non-existent user", async () => {
      mockPool.query.mockResolvedValueOnce({ recordset: [] });
      const result = await loginUser(validCredentials);
      expect(result).toBeNull();
    });
  });

  describe("authorize", () => {
    it("throws error for missing credentials", async () => {
      await expect(
        authorize(
          {
            username: "",
            password: "",
            email: "",
            action: "login",
          },
          mockReq
        )
      ).rejects.toThrow("Missing required fields");
    });

    it("throws error for invalid action", async () => {
      await expect(
        authorize(
          {
            username: "test",
            password: "test",
            email: "",
            action: "invalid",
          },
          mockReq
        )
      ).rejects.toThrow("Invalid action");
    });

    it("successfully handles registration", async () => {
      mockPool.query
        .mockResolvedValueOnce({ recordset: [] })
        .mockResolvedValueOnce({
          recordset: [
            {
              id: "1",
              username: "testuser",
              email: "test@example.com",
            },
          ],
        });

      const result = await authorize(
        {
          username: "testuser",
          email: "test@example.com",
          password: "password123",
          action: "register",
        },
        mockReq
      );

      expect(result).toEqual({
        id: "1",
        username: "testuser",
        email: "test@example.com",
      });
    });

    it("successfully handles login", async () => {
      mockPool.query.mockResolvedValueOnce({
        recordset: [
          {
            id: "1",
            username: "testuser",
            email: "test@example.com",
            password: "hashedPassword123",
          },
        ],
      });

      const result = await authorize(
        {
          username: "testuser",
          password: "password123",
          email: "",
          action: "login",
        },
        mockReq
      );

      expect(result).toEqual({
        id: "1",
        username: "testuser",
        email: "test@example.com",
      });
    });
  });

  describe("Callbacks", () => {
    it("jwt callback includes user data", async () => {
      const token = {};
      const user = { id: "1", username: "testuser" };

      const result = await authOptions.callbacks!.jwt!({
        token,
        user,
        trigger: "signIn",
        account: null,
      });

      expect(result).toEqual({
        id: "1",
        username: "testuser",
      });
    });

    it("session callback includes user data", async () => {
      const session: Session = {
        user: {},
        expires: new Date().toISOString(),
      };
      const token = { id: "1", username: "testuser" };

      const result = await authOptions.callbacks!.session!({
        session,
        token,
        trigger: "update",
        newSession: null,
        user: {
          id: "1",
          email: "test@example.com",
          emailVerified: null,
        } as AdapterUser,
      });

      expect(result.user).toEqual({
        id: "1",
        name: "testuser",
      });
    });
  });
});
