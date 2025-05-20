import { HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

export default async function AdminPage() {
  const page = await api.page.get();

  if (!page) {
    redirect("/onboarding");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center"></main>
    </HydrateClient>
  );
}
