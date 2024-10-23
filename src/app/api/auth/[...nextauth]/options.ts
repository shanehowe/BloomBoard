import type { User } from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/utils/db";
import { hashPassword } from "@/utils/auth";
import sql from "mssql";

async function registerUser(
  credentials: Record<string, string>,
): Promise<User> {
  const { username, email, password } = credentials;

  if (!email) {
    throw new Error("Email is required for registration");
  }

  const pool = await connectToDatabase();

  // Check if user already exists
  const existingUser = await pool
    .request()
    .input("username", sql.NVarChar, username)
    .input("email", sql.NVarChar, email)
    .query("SELECT * FROM Users WHERE username = @username OR email = @email");

  if (existingUser.recordset.length > 0) {
    throw new Error("Username or email already exists");
  }

  // Create new user
  const hashedPassword = await hashPassword(password);
  const insertResult = await pool
    .request()
    .input("username", sql.NVarChar, username)
    .input("email", sql.NVarChar, email)
    .input("password", sql.NVarChar, hashedPassword)
    .query<User>(
      "INSERT INTO Users (username, email, password) OUTPUT INSERTED.id, INSERTED.username, INSERTED.email VALUES (@username, @email, @password)",
    );

  const newUser = insertResult.recordset[0];
  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  };
}

async function loginUser(
  credentials: Record<string, string>,
): Promise<User | null> {
  const { username, password } = credentials;

  const pool = await connectToDatabase();
  const userResult = await pool
    .request()
    .input("username", sql.NVarChar, username)
    .query<
      User & { password: string }
    >("SELECT * FROM Users WHERE username = @username");

  const user = userResult.recordset[0];

  if (user && (await bcrypt.compare(password, user.password))) {
    return { id: user.id, username: user.username, email: user.email };
  }

  return null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        if (
          !credentials?.username ||
          !credentials?.password ||
          !credentials?.action
        ) {
          throw new Error("Missing required fields");
        }

        try {
          if (credentials.action === "register") {
            return await registerUser(credentials);
          } else {
            return await loginUser(credentials);
          }
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
