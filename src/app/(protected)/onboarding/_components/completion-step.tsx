import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  onBack: () => void;
  isSubmitting: boolean;
};

export const CompletionStep = ({ onBack, isSubmitting }: Props) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Logo width={80} height={80} />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">You&apos;re all set!</h1>
        <p className="text-muted-foreground text-sm">
          You can now start using your page! You can always edit it on the{" "}
          <Link href="/admin" className="text-accent">
            admin page
          </Link>
          !
        </p>
      </div>
      <div className="flex w-full gap-4">
        <Button
          className="flex-1"
          variant="secondary"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          className="flex-1"
          variant="accent"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Complete
        </Button>
      </div>
    </div>
  );
};
