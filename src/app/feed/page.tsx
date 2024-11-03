"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EventList } from "@/components/event-list/event-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useEventFeed } from "@/hooks/use-event-feed";

export default function EventFeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { events, isLoading } = useEventFeed(session?.user.id);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center mt-5 space-y-5">
        <EventLoadingSkeleton />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col items-center mt-5 space-y-5">
      {isLoading ? <EventLoadingSkeleton /> : <EventList events={events} />}
    </div>
  );
}

function EventLoadingSkeleton() {
  const events = Array.from({ length: 3 }, (_, i) => i);
  return (
    <>
      {events.map((event) => (
        <div key={event} className="flex flex-col space-y-3 mt-3">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-[225px] w-[450px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </>
  );
}
