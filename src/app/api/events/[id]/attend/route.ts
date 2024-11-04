import { EventRepo } from "@/core/repositories/EventRepo";
import { EventService } from "@/core/services/EventService";
import { getSession } from "@/utils/getSession";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession(request);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idAsNumber = Number(id);
  if (isNaN(idAsNumber)) {
    return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
  }

  const service = new EventService(new EventRepo());

  try {
    await service.registerAttendee(idAsNumber, session.user.id);
  } catch (error) {
    console.error("Error registering attendee:", error);
    return NextResponse.json(
      { error: "Failed to register attendee" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Attendee registered successfully" },
    { status: 200 }
  );
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession(request);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idAsNumber = Number(id);
  if (isNaN(idAsNumber)) {
    return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
  }

  const service = new EventService(new EventRepo());

  try {
    await service.cancelAttendee(idAsNumber, session.user.id);
  } catch (error) {
    console.error("Error cancelling attendee:", error);
    return NextResponse.json(
      { error: "Failed to cancel attendee" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Attendee cancelled" }, { status: 200 });
}
