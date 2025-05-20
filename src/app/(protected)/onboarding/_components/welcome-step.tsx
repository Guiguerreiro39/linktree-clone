import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

type Props = {
  onNext: () => void;
};

export const WelcomeStep = ({ onNext }: Props) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Logo width={80} height={80} />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to RootLink!</h1>
        <p className="text-muted-foreground text-sm">
          Let&apos;s get you started with your own personalized page! It&apos;ll
          only take a minute and you can always change it later.
        </p>
      </div>
      <Button className="w-full" variant="accent" onClick={onNext}>
        Let&apos;s go!
      </Button>
    </div>
  );
};
