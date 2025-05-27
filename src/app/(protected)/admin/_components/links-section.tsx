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

export const LinksSection = () => {
  const [data] = api.link.getAll.useSuspenseQuery();

  const form = useForm<z.infer<typeof linksSchema>>({
    mode: "onChange",
    resolver: zodResolver(linksSchema),
    defaultValues: {
      links:
        data?.map((link) => ({
          linkId: link.id,
          name: link.name ?? "",
          url: link.url ?? "",
        })) ?? [],
    },
  });

  const { fields, remove, replace, append } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const { mutateAsync: deleteMutation } = api.link.delete.useMutation();

  const { mutateAsync: updateMutation } = api.link.bulkUpdate.useMutation();

  const { mutateAsync: createMutation } = api.link.create.useMutation();

  const handleCreate = async () => {
    const newLink = await createMutation({
      name: "",
      url: "",
      order: fields.length - 1,
    });

    // Add toast
    if (!newLink[0]) return;

    append({
      linkId: newLink[0].id,
      name: newLink[0].name ?? "",
      url: newLink[0].url ?? "",
    });
  };

  const handleUpdate = async (newLinks: typeof fields) => {
    const result = await updateMutation({
      links: newLinks.map((link, index) => ({
        id: link.linkId,
        name: link.name,
        url: link.url,
        order: index,
      })),
    });

    if (!result.success) {
      // Add toast
      return;
    }

    replace(newLinks);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteMutation({ id });

    if (!result.success) {
      // Add toast
      return;
    }

    remove(fields.findIndex((link) => link.id === id));
  };

  return (
    <Form {...form}>
      <form className="max-w-3xl space-y-4">
        <h1 className="text-xl font-bold">Links</h1>
        <Button type="button" variant="dashed" size="sm" onClick={handleCreate}>
          <Plus /> Add new link
        </Button>
        <SortableList
          items={fields}
          onChange={handleUpdate}
          renderItem={(link, index) => (
            <SortableItem id={link.id}>
              <LinkItem
                register={form.register}
                nameField={`links.${index}.name`}
                urlField={`links.${index}.url`}
                onRemove={() => handleDelete(link.linkId)}
              />
            </SortableItem>
          )}
        />
      </form>
    </Form>
  );
};
