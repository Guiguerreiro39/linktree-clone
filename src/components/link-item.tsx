import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import type { FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

type Props<TFormValues extends FieldValues> = {
  onRemove: () => void;
  register: UseFormRegister<TFormValues>;
  nameField: FieldPath<TFormValues>;
  urlField: FieldPath<TFormValues>;
};

export const LinkItem = <TFormValues extends FieldValues>({
  register,
  onRemove,
  nameField,
  urlField,
}: Props<TFormValues>) => {
  return (
    <Card className="w-full py-2">
      <CardContent className="flex items-center justify-between px-4">
        <div className="flex flex-1 flex-col gap-1">
          <input
            {...register(nameField)}
            className="min-w-0 font-semibold focus:outline-none"
          />
          <input
            className="text-muted-foreground w-full text-xs focus:outline-none"
            {...register(urlField)}
          />
        </div>
        <Button variant="destructive" size="icon" onClick={onRemove}>
          <Trash2 />
        </Button>
      </CardContent>
    </Card>
  );
};
