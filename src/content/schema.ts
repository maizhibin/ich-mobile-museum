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

const audioGuideChapterSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  start: z.number().nonnegative(),
});
const audioGuideCueSchema = z.object({
  chapterId: z.string().regex(/^[a-z0-9-]+$/),
  start: z.number().nonnegative(),
  end: z.number().positive(),
  text: z.string().min(1),
});
export const audioGuideSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    language: z.literal("zh-CN"),
    updatedAt: z.iso.date(),
    audio: z.object({
      src: z.string().min(1),
      mimeType: z.literal("audio/mp4"),
      durationSeconds: z.number().positive(),
      voice: z.string().min(1),
      disclosure: z.string().min(1),
      rights: z.string().min(1),
    }),
    sources: z
      .array(
        z.object({
          title: z.string().min(1),
          url: z.url(),
        }),
      )
      .min(1),
    chapters: z.array(audioGuideChapterSchema).min(1),
    cues: z.array(audioGuideCueSchema).min(1),
  })
  .superRefine((guide, context) => {
    const chapterIds = new Set(guide.chapters.map(({ id }) => id));
    guide.cues.forEach((cue, index) => {
      if (!chapterIds.has(cue.chapterId)) {
        context.addIssue({
          code: "custom",
          path: ["cues", index, "chapterId"],
          message: "文字稿时间点必须关联到已有章节",
        });
      }
      if (cue.end <= cue.start) {
        context.addIssue({
          code: "custom",
          path: ["cues", index, "end"],
          message: "文字稿结束时间必须晚于开始时间",
        });
      }
    });
  });
export type AudioGuide = z.infer<typeof audioGuideSchema>;
