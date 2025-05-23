import type { formSchema } from "@/app/(protected)/onboarding/schemas";
import { LinkItem } from "@/components/link-item";
import { NewLinkDialog } from "@/components/new-link-dialog";
import { SortableItem } from "@/components/sortable-item";
import { SortableList } from "@/components/sortable-list";
import { Button } from "@/components/ui/button";
import {
  useFieldArray,
  type Control,
  type UseFormRegister,
} from "react-hook-form";
import type { z } from "zod";

type Props = {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  control: Control<z.infer<typeof formSchema>>;
  register: UseFormRegister<z.infer<typeof formSchema>>;
};

export const LinksStep = ({
  onNext,
  onBack,
  onSkip,
  control,
  register,
}: Props) => {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "links",
  });

  console.log(fields);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">Add Your First Links</h1>
          <Button
            variant="ghost"
            className="text-sm"
            onClick={onSkip}
            type="button"
          >
            Skip
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Let&apos;s add your first links to get started! This could be your
          website, social media profile, or any other URL you&apos;d like to
          share
        </p>
      </div>

      <NewLinkDialog onSubmit={(link) => append(link)} />

      <SortableList
        items={fields}
        onChange={(newLinks) => replace(newLinks)}
        renderItem={(link, index) => (
          <SortableItem id={link.id}>
            <LinkItem
              register={register}
              nameField={`links.${index}.name`}
              urlField={`links.${index}.url`}
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
