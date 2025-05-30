import { HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { BasicInfoSection } from "./_components/basic-info-section";
import { LinksSection } from "./_components/links-section";

export default async function AdminPage() {
  const page = await api.page.get();

  if (!page) {
    redirect("/onboarding");
  }

  void (await api.link.getAll.prefetch());

  return (
    <HydrateClient>
      <main className="container mx-auto max-w-4xl space-y-8 overflow-auto px-2">
        <BasicInfoSection page={page} />
        <LinksSection />
      </main>
    </HydrateClient>
  );
}
