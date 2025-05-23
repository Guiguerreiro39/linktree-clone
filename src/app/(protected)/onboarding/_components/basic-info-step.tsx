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

import { Textarea } from "@/components/ui/textarea";
import { InputAvatar } from "@/components/input-avatar";

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
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between gap-2">
              <FormLabel>Image</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <InputAvatar onChange={field.onChange} value={field.value} />
            </FormControl>
            <FormDescription>
              This is the image that will be displayed on your page.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tag"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between gap-2">
              <FormLabel>Tag</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  placeholder="rootlink"
                  className="peer ps-6 pe-12"
                />
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                  @
                </span>
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                  .rootlink.com
                </span>
              </div>
            </FormControl>
            <FormDescription>This is your public display tag.</FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between gap-2">
              <FormLabel>Bio</FormLabel>
              <FormMessage />
            </div>
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
