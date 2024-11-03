import { connectToDatabase } from "@/utils/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="p-6 md:p-8 space-y-8">
            {/* Hero Section */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Welcome to BloomBoard
                </h1>
                <p className="text-lg text-gray-600">
                  Your go-to platform for discovering, creating, and joining
                  local events. Connect with people who share your interests and
                  make every moment count.
                </p>
                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/register">Get Started</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </div>

              {/* Cover Image */}
              <div className="relative aspect-video md:aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/images/welcome-image.jpg"
                  alt="BloomBoard Dashboard Preview"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              {[
                {
                  title: "Discover Events",
                  description:
                    "Discover and explore exciting events near you: casual crowd-meets, fantastic festivals, or great gatherings.",
                },
                {
                  title: "Easy Event Creation",
                  description:
                    "Create and host your own events in minutes, with beautiful cover images, captivating descriptions, and other important details.",
                },
                {
                  title: "Social Connection",
                  description:
                    "Meet like-minded people, build your network, and track the events you're attending or hosting - all from a single platform.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
