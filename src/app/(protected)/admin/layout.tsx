import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="bg-background flex h-screen w-full flex-col">
      <Navbar />
      <div className="pb-6">{children}</div>
    </main>
  );
}
