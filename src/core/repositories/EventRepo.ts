import { connectToDatabase } from "@/utils/db";
import { EventDTO, IEvent } from "../interfaces/IEvent";

export class EventRepo {
  async findAll(userId: string): Promise<IEvent[]> {
    const pool = await connectToDatabase();
    const result = await pool.request().input("userId", userId).query(`
      SELECT * FROM Events
      WHERE date >= GETDATE()
      and userId != @userId
    `);
    return result.recordset as IEvent[];
  }

  async create(event: EventDTO): Promise<IEvent> {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("userId", event.userId)
      .input("title", event.title)
      .input("description", event.description)
      .input("date", event.date)
      .input("county", event.county)
      .input("maxAttendees", event.maxAttendees)
      .input("imageUrl", event.imageUrl || null).query(`
        INSERT INTO Events (userId, title, description, date, county, maxAttendees, imageUrl)
        OUTPUT INSERTED.*
        VALUES (@userId, @title, @description, @date, @county, @maxAttendees, @imageUrl)
      `);
    return result.recordset[0] as IEvent;
  }

  async cancelAttendee(eventId: number, userId: number): Promise<void> {
    const pool = await connectToDatabase();
    await pool.request().input("eventId", eventId).input("userId", userId)
      .query(`
        DELETE FROM Attendees
        WHERE eventId = @eventId AND userId = @userId
      `);
  }
}
