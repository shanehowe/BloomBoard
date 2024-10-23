import { EventService } from "@/core/services/EventService";
import { EventRepo } from "@/core/repositories/EventRepo";
import { type NextRequest, NextResponse } from "next/server";

function getEventService() {
  const eventRepo = new EventRepo();
  return new EventService(eventRepo);
}

export async function GET(request: NextRequest) {
  const urlQuery = new URL(request.url).searchParams;
  const county = urlQuery.get("county");
  if (!county) {
    return NextResponse.json(
      { error: "Missing required field 'county'" },
      { status: 400 },
    );
  }

  try {
    const eventService = getEventService();
    const events = await eventService.listEventsByCounty(county);

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const eventService = getEventService();
    const body = await request.json();
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
