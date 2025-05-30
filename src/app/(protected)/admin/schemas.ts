import z from "zod";

export const basicInformationSchema = z.object({
  tag: z
    .string()
    .min(1, { message: "Tag must be at least 1 character long" })
    .max(30, { message: "Tag must be at most 30 characters long" })
    .refine(
      (value) => {
        const isValid = /[^a-z0-9-]/g.test(value);
        if (!isValid) return true;

        return false;
      },
      {
        message:
          "Tag should contain only lowercase letters, numbers, and hyphens",
      },
    ),
  bio: z
    .string()
    .max(160, { message: "Bio must be at most 160 characters long" })
    .optional(),
  imageUrl: z.union([z.string().url().optional(), z.literal("")]),
});

export const linksSchema = z.object({
  links: z.array(
    z.object({
      id: z.string(),
      name: z.string().max(80).optional(),
      url: z.union([z.string().url().optional(), z.literal("")]),
      order: z.number(),
    }),
  ),
});
