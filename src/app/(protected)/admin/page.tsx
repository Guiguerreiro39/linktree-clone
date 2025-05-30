import { HydrateClient } from "@/trpc/server";
import { api } from "@/trpc/server";
import { BasicInfoSection } from "./_components/basic-info-section";
import { LinksSection } from "./_components/links-section";

export default function AdminPage() {
  void api.page.getMyPage.prefetch();
  void api.link.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="container mx-auto max-w-4xl space-y-8 overflow-auto px-2">
        <BasicInfoSection />
        <LinksSection />
      </main>
    </HydrateClient>
  );
}
