"use client";

import { linksSchema } from "@/app/(protected)/admin/schemas";
import { LinkItem } from "@/components/link-item";
import { SortableItem } from "@/components/sortable-item";
import { SortableList } from "@/components/sortable-list";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { api } from "@/trpc/react";
import { useMemo } from "react";
import { useGetChanges } from "./hooks/use-get-changes";
import { toast } from "sonner";
import { getFormFirstError } from "@/helpers/get-form-first-error";

export const LinksSection = () => {
  const [data] = api.link.getAll.useSuspenseQuery();

  const initialFormData = useMemo(
    () =>
      data.map((link) => ({
        id: link.id,
        name: link.name ?? "",
        url: link.url ?? "",
        order: link.order,
      })),
    [data],
  );

  const form = useForm<z.infer<typeof linksSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(linksSchema),
    defaultValues: {
      links: initialFormData,
    },
  });

  const currentLinks = form.watch("links");

  const { remove, replace, append } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const { mutateAsync: deleteMutation, isPending: isDeleting } =
    api.link.bulkDelete.useMutation();
  const { mutateAsync: updateMutation, isPending: isUpdating } =
    api.link.bulkUpdate.useMutation();
  const { mutateAsync: bulkCreateMutation, isPending: isCreating } =
    api.link.bulkCreate.useMutation();

  const isPending = isDeleting || isUpdating || isCreating;

  const getChanges = useGetChanges(initialFormData);

  const onSubmit = async (values: z.infer<typeof linksSchema>) => {
    const changes = getChanges(values.links);

    if (changes.toCreate.length > 0) {
      await bulkCreateMutation({
        links: changes.toCreate.map((link) => ({
          name: link.name,
          url: link.url,
          order: link.order,
        })),
      });
    }

    if (changes.toUpdate.length > 0) {
      await updateMutation({
        links: changes.toUpdate.map((link) => ({
          id: link.id,
          name: link.name,
          url: link.url,
          order: link.order,
        })),
      });
    }

    if (changes.toDelete.length > 0) {
      await deleteMutation({
        ids: changes.toDelete.map((link) => link.id),
      });
    }

    toast.success("Links saved successfully");
  };

  return (
    <Form {...form}>
      <form
        className="max-w-3xl space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Links</h1>
          {form.formState.isDirty && (
            <Button isLoading={isPending} variant="outline" type="submit">
              Save
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="dashed"
            size="sm"
            onClick={() => {
              append({
                id: `temp-${Date.now()}`,
                name: "",
                url: "",
                order: currentLinks.length,
              });
            }}
          >
            <Plus /> Add new link
          </Button>
          <p className="text-destructive mr-8 text-sm">
            {getFormFirstError(form.formState.errors)}
          </p>
        </div>
        <SortableList
          items={currentLinks}
          onChange={(newLinks) => {
            replace(
              newLinks.map((link, index) => ({
                ...link,
                order: index + 1,
              })),
            );
          }}
          renderItem={(link, index) => (
            <SortableItem id={link.id}>
              <LinkItem
                control={form.control}
                fields={{
                  name: `links.${index}.name`,
                  url: `links.${index}.url`,
                }}
                onRemove={() =>
                  remove(currentLinks.findIndex((item) => item.id === link.id))
                }
              />
            </SortableItem>
          )}
        />
      </form>
    </Form>
  );
};
