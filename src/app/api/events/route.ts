import { EventService } from "@/core/services/EventService";
import { EventRepo } from "@/core/repositories/EventRepo";
import { type NextRequest, NextResponse } from "next/server";
import { IEvent } from "@/core/interfaces/IEvent";
import { getSession } from "@/utils/getSession";

function getEventService() {
  const eventRepo = new EventRepo();
  return new EventService(eventRepo);
}

export async function GET(request: NextRequest) {
  const urlQuery = new URL(request.url).searchParams;
  const userId = urlQuery.get("userId");
  if (!userId) {
    return NextResponse.json(
      { error: "Missing required field 'userId'" },
      { status: 400 },
    );
  }

  try {
    const eventService = getEventService();
    const events = await eventService.findEventsNotCreatedByUserId(userId);

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, response: NextResponse) {
  const eventService = getEventService();
  const session = await getSession(request, response);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as IEvent;
    body.userId = session?.user.id;
    console.log("Creating event with body:", body);
    const event = await eventService.create(body);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
