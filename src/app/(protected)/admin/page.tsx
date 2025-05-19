import { api, HydrateClient } from "@/trpc/server";
import { SignOutButton } from "@clerk/nextjs";

export default async function Home() {
  void api.link.getMany.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <SignOutButton />
      </main>
    </HydrateClient>
  );
}
