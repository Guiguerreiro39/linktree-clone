import { Logo } from "@/components/logo";
import { UserProfileDefault } from "@/components/user-profile-default";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 flex flex-col">
      <div className="bg-sidebar flex items-center justify-between px-4 py-3 text-white">
        <Logo width={18} height={18} />
        <UserButton
          appearance={{ variables: { colorText: "white" } }}
          showName
          fallback={<UserProfileDefault />}
        />
      </div>
    </nav>
  );
}
