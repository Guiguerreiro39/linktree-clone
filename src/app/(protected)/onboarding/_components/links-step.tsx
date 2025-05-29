import type { formSchema } from "@/app/(protected)/onboarding/schemas";
import { LinkItem } from "@/components/link-item";

import { SortableItem } from "@/components/sortable-item";
import { SortableList } from "@/components/sortable-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFieldArray, useWatch, type Control } from "react-hook-form";
import type { z } from "zod";

type Props = {
  onNext: () => void;
  onBack: () => void;
  control: Control<z.infer<typeof formSchema>>;
};

export const LinksStep = ({ onNext, onBack, control }: Props) => {
  const { append, remove, replace } = useFieldArray({
    control,
    name: "links",
  });

  const currentLinks = useWatch({
    control,
    name: "links",
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Add Your First Links</h1>

        <p className="text-muted-foreground text-sm">
          Let&apos;s add your first links to get started! This could be your
          website, social media profile, or any other URL you&apos;d like to
          share
        </p>
      </div>

      <Button
        type="button"
        variant="dashed"
        size="sm"
        onClick={() => append({ name: "", url: "", id: `temp-${Date.now()}` })}
      >
        <Plus /> Add new link
      </Button>

      <SortableList
        items={currentLinks}
        onChange={(newLinks) => replace(newLinks)}
        renderItem={(link, index) => (
          <SortableItem id={link.id}>
            <LinkItem
              control={control}
              fields={{
                name: `links.${index}.name`,
                url: `links.${index}.url`,
              }}
              onRemove={() => remove(index)}
            />
          </SortableItem>
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
