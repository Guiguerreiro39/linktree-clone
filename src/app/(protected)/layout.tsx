import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="w-full space-y-2">
      <Navbar />
      {children}
    </main>
  );
}
