import { Logo } from "@/components/logo";
import { UserProfileDefault } from "@/components/user-profile-default";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 flex flex-col">
      <div className="bg-sidebar flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-8">
          <Link href="/admin">
            <Logo width={18} height={18} />
          </Link>
          <Link href="/admin" className="text-sm hover:underline">
            My Page
          </Link>
          <Link href="/admin/preview" className="text-sm hover:underline">
            Preview
          </Link>
          <Link href="/admin/analytics" className="text-sm hover:underline">
            Analytics
          </Link>
        </div>
        <UserButton
          appearance={{
            elements: { userButtonOuterIdentifier: "!text-white" },
          }}
          showName
          fallback={<UserProfileDefault />}
        />
      </div>
      <div className="bg-sidebar">
        <div className="bg-background h-6 w-full rounded-t-2xl" />
      </div>
    </nav>
  );
}
