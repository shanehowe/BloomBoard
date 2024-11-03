import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { getServerSession, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type ServerRequest = NextRequest | Request;
type ServerResponse = NextResponse | Response;

export async function getSession(req: ServerRequest): Promise<Session | null>;
export async function getSession(
  req: ServerRequest,
  res: ServerResponse,
): Promise<Session | null>;
export async function getSession(
  req: ServerRequest,
  res?: ServerResponse,
): Promise<Session | null> {
  if (!res) {
    res = new Response("");
  }
  return await getServerSession({ req, res, ...authOptions });
}
