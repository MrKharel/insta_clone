import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  handle: z.string(),
  display_name: z.string().nullable(),
  email: z.string(),
  avatar_url: z.string().nullable(),
  website: z.string().nullable(),
  bio: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const updateUserSchema = userSchema
  .pick({
    handle: true,
    display_name: true,
    website: true,
    bio: true,
  })
  .partial()
  .and(
    z
      .object({
        avatar_url: z.file(),
      })
      .partial(),
  );

export type UpdateUser = z.infer<typeof updateUserSchema>;
