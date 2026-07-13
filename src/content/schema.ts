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

export const listTypeSchema = z.enum([
  "REPRESENTATIVE",
  "URGENT_SAFEGUARDING",
  "GOOD_PRACTICE",
]);
export const unescoElementSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  year: z.number().int().min(2008),
  listType: listTypeSchema,
  museums: z.array(z.string()).min(1),
});
export const unescoElementsSchema = z.array(unescoElementSchema).length(45);
export type UnescoElement = z.infer<typeof unescoElementSchema>;

export const museumSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  symbol: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
});
export const museumsSchema = z.array(museumSchema).length(9);
export type Museum = z.infer<typeof museumSchema>;
