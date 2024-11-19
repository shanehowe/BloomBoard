"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CreateEventDetails,
  CreateEventDialog,
} from "./create-event-dialog/createEventDialog";
import { useToast } from "@/hooks/use-toast";
import { useCreateEvent } from "@/hooks/use-create-event";

export function Navbar() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { error, createEvent, loading } = useCreateEvent();

  const handleCreate = async (
    eventDetails: CreateEventDetails,
    image: File | null,
  ) => {
    const event = await createEvent(eventDetails, image);
    if (error) {
      toast({
        title: "Error",
        description: error,
      });
    } else {
      toast({
        title: "Event created",
        description: `${event!.title} in ${event!.county} created successfully`,
      });
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <Link href="/" className="text-xl font-bold">
        BloomBoard
      </Link>
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <Link href={'/feed'}>
              Feed
            </Link>
            <CreateEventDialog onCreate={handleCreate} loading={loading} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{session.user.name}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
