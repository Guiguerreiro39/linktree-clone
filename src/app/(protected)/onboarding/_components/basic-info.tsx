import { Button } from "@/components/ui/button";
import type { Control } from "react-hook-form";
import type { z } from "zod";
import type { formSchema } from "../schemas";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { enforceFirstLetter } from "@/helpers/enforce-first-letter";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onNext: () => void;
  onBack: () => void;
  control: Control<z.infer<typeof formSchema>>;
};

export const BasicInfoStep = ({ onNext, onBack, control }: Props) => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Basic Information</h1>
      <FormField
        control={control}
        name="tag"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tag</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <Input
                  {...field}
                  type="text"
                  placeholder="@rootlink"
                  onChange={(e) =>
                    field.onChange(enforceFirstLetter("@", e.target.value))
                  }
                />
              </div>
            </FormControl>
            <FormDescription>This is your public display tag.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Write something about your page..."
                className="min-h-32"
                {...field}
              />
            </FormControl>
            <FormDescription>
              This is the bio that will be displayed on your page.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-4">
        <Button
          className="flex-1"
          variant="secondary"
          onClick={onBack}
          type="button"
        >
          Back
        </Button>
        <Button
          className="flex-1"
          variant="accent"
          onClick={onNext}
          type="button"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
