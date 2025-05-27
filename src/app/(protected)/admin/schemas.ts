import z from "zod";

export const basicInformationSchema = z.object({
  tag: z
    .string()
    .min(1, { message: "Tag must be at least 1 character long" })
    .max(30, { message: "Tag must be at most 30 characters long" }),
  bio: z
    .string()
    .max(160, { message: "Bio must be at most 160 characters long" }),
  imageUrl: z.string().url().optional(),
});

export const linksSchema = z.object({
  links: z.array(
    z.object({
      linkId: z.string(),
      name: z.string().max(80).optional(),
      url: z.string().optional(),
    }),
  ),
});
