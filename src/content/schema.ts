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

const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
});
const processStepSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int().positive(),
  title: z.string().min(1),
  summary: z.string().min(1),
  detail: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1),
});
const processFlowSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    accessibilityLabel: z.string().min(1),
    steps: z.array(processStepSchema).min(2),
  })
  .superRefine((flow, context) => {
    const ids = new Set<string>();
    flow.steps.forEach((step, index) => {
      if (ids.has(step.id)) {
        context.addIssue({
          code: "custom",
          path: ["steps", index, "id"],
          message: "工序 ID 不可重复",
        });
      }
      ids.add(step.id);
      if (step.order !== index + 1) {
        context.addIssue({
          code: "custom",
          path: ["steps", index, "order"],
          message: "工序顺序必须从 1 连续递增",
        });
      }
    });
  });

export const teaExhibitionSchema = z
  .object({
    id: z.literal("traditional-tea"),
    name: z.string().min(1),
    year: z.literal(2022),
    listType: z.literal("REPRESENTATIVE"),
    updatedAt: z.iso.date(),
    summary: z.string().min(1),
    description: z.string().min(1),
    cover: z.string().min(1),
    rights: z.string().min(1),
    gallery: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          src: z.string().min(1),
          alt: z.string().min(1),
          title: z.string().min(1),
          description: z.string().min(1),
        }),
      )
      .min(3),
    sources: z.array(sourceSchema).min(1),
    process: processFlowSchema,
    regionalPractices: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          name: z.string().min(1),
          teaCategory: z.string().min(1),
          place: z.string().min(1),
          processFocus: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
          summary: z.string().min(1),
          disclosure: z.string().min(1),
        }),
      )
      .length(5),
    makingPaths: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          title: z.string().min(1),
          label: z.string().min(1),
          summary: z.string().min(1),
          focusSteps: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
          processNotes: z.array(z.string().min(1)).min(2),
          disclosure: z.string().min(1),
        }),
      )
      .min(3),
    socialContexts: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          title: z.string().min(1),
          prompt: z.string().min(1),
          response: z.string().min(1),
          keywords: z.array(z.string().min(1)).min(1),
        }),
      )
      .min(3),
    teaWare: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          name: z.string().min(1),
          role: z.string().min(1),
          description: z.string().min(1),
          materialHint: z.string().min(1),
        }),
      )
      .min(4),
  })
  .superRefine((exhibition, context) => {
    const stepIds = new Set(exhibition.process.steps.map(({ id }) => id));
    exhibition.regionalPractices.forEach((practice, practiceIndex) => {
      practice.processFocus.forEach((stepId, focusIndex) => {
        if (!stepIds.has(stepId)) {
          context.addIssue({
            code: "custom",
            path: [
              "regionalPractices",
              practiceIndex,
              "processFocus",
              focusIndex,
            ],
            message: "地方实践必须引用已有工序 ID",
          });
        }
      });
    });
    exhibition.makingPaths.forEach((path, pathIndex) => {
      path.focusSteps.forEach((stepId, focusIndex) => {
        if (!stepIds.has(stepId)) {
          context.addIssue({
            code: "custom",
            path: ["makingPaths", pathIndex, "focusSteps", focusIndex],
            message: "制茶观察路径必须引用已有工序 ID",
          });
        }
      });
    });
  });
export type ProcessFlowData = z.infer<typeof processFlowSchema>;
export type TeaExhibition = z.infer<typeof teaExhibitionSchema>;
