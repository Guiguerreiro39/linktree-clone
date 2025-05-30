import Navbar from "@/components/navbar";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await api.user.getMe();

  if (!user.isOnboarded) {
    redirect("/onboarding");
  }

  return (
    <main className="bg-background flex h-screen w-full flex-col">
      <Navbar />
      <div className="pb-6">{children}</div>
    </main>
  );
}
