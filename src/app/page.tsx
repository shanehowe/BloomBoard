import { connectToDatabase } from "@/utils/db";
import React from "react";

export default async function Home() {
  try {
    await connectToDatabase();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Expected fail on first connection.
    // Ensures database is primed for further requests.
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mt-8 mb-4">Welcome to BloomBoard</h1>
    </div>
  );
}
