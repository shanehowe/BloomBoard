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
import { CreateEventDialog } from "./create-event-dialog/createEventDialog";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <Link href="/" className="text-xl font-bold">
        BloomBoard
      </Link>
      <div className="flex items-center space-x-4">
        {session ? (
          <>
          <CreateEventDialog onCreate={(details) => console.log('Creating event', details)} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{session.user.name}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/my-events">My Events</Link>
              </DropdownMenuItem>
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
