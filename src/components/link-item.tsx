import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormMessage } from "@/components/ui/form";
import { Trash2 } from "lucide-react";
import type { FieldPath, FieldValues, Control } from "react-hook-form";

type Props<TFormValues extends FieldValues> = {
  onRemove: () => void;
  control: Control<TFormValues>;
  fields: {
    name: FieldPath<TFormValues>;
    url: FieldPath<TFormValues>;
  };
};

export const LinkItem = <TFormValues extends FieldValues>({
  control,
  onRemove,
  fields,
}: Props<TFormValues>) => {
  return (
    <Card className="w-full py-2">
      <CardContent className="flex items-center justify-between px-4">
        <div className="flex flex-1 flex-col gap-1">
          <FormField
            control={control}
            name={fields.name}
            render={({ field }) => (
              <input
                {...field}
                maxLength={80}
                placeholder="Name of your link"
                className="min-w-0 font-semibold focus:outline-none"
              />
            )}
          />
          <FormField
            control={control}
            name={fields.url}
            render={({ field }) => (
              <input
                {...field}
                className="text-muted-foreground w-full text-xs focus:outline-none"
                placeholder="URL of your link"
              />
            )}
          />
        </div>
        <Button variant="destructive" size="icon" onClick={onRemove}>
          <Trash2 />
        </Button>
      </CardContent>
    </Card>
  );
};
