import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="bg-sidebar w-full">
      <Navbar />
      <div className="bg-background rounded-t-2xl p-4">{children}</div>
    </main>
  );
}
