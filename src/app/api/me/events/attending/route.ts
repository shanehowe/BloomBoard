import { EventRepo } from "@/core/repositories/EventRepo";
import { EventService } from "@/core/services/EventService";
import { getSession } from "@/utils/getSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getSession(request);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventService = new EventService(new EventRepo());

  try {
    const events = await eventService.findUserAttendingEvents(session.user.id);
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong, try again later" },
      { status: 500 },
    );
  }
}
