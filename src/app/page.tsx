import { HydrateClient } from "@/trpc/server";
import { SignOutButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <SignOutButton />
      </main>
    </HydrateClient>
  );
}
