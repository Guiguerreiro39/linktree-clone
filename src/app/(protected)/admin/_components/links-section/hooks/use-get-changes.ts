import type { linksSchema } from "@/app/(protected)/admin/schemas";
import { useCallback } from "react";
import type z from "zod";

export const useGetChanges = (
  initialData: z.infer<typeof linksSchema>["links"],
) => {
  return useCallback(
    (currentData: z.infer<typeof linksSchema>["links"]) => {
      // Find items to create (temporary IDs starting with 'temp-')
      const toCreate = currentData.filter((link) =>
        link.id.startsWith("temp-"),
      );

      // Find items to update (existing IDs with changed data)
      const toUpdate = currentData.filter((link) => {
        if (link.id.startsWith("temp-")) return false;

        const original = initialData.find((orig) => orig.id === link.id);
        if (!original) return false;

        return (
          original.name !== link.name ||
          original.url !== link.url ||
          initialData.indexOf(original) !== currentData.indexOf(link) // order changed
        );
      });

      // Find items to delete (in original but not in current)
      const currentIds = new Set(
        currentData
          .map((link) => link.id)
          .filter((id) => !id.startsWith("temp-")),
      );
      const toDelete = initialData.filter((link) => !currentIds.has(link.id));

      return { toCreate, toUpdate, toDelete };
    },
    [initialData],
  );
};
