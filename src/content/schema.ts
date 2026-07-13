import { z } from "zod";

export const exhibitionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  place: z.string().min(1),
  theme: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  cover: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  featured: z.boolean(),
});

export const exhibitionsSchema = z.array(exhibitionSchema);
export type Exhibition = z.infer<typeof exhibitionSchema>;
