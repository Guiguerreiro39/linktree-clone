import z from "zod";

export const formSchema = z.object({
  tag: z
    .string()
    .min(1, { message: "Tag must be at least 1 character long" })
    .max(30, { message: "Tag must be at most 30 characters long" }),
  bio: z
    .string()
    .max(160, { message: "Bio must be at most 160 characters long" }),
  imageUrl: z.string().url().optional(),
  links: z.array(
    z.object({
      name: z
        .string()
        .min(1, { message: "Name must be at least 1 character long" })
        .max(30, { message: "Name must be at most 30 characters long" }),
      url: z.string().url(),
    }),
  ),
});
