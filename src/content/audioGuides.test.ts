import { describe, expect, it } from "vitest";
import { jingjuAudioGuide } from "./audioGuides";

describe("京剧三分钟导览素材", () => {
  it("包含约三分钟音频、五个章节和逐句时间轴", () => {
    expect(jingjuAudioGuide.audio.durationSeconds).toBeGreaterThanOrEqual(170);
    expect(jingjuAudioGuide.audio.durationSeconds).toBeLessThanOrEqual(190);
    expect(jingjuAudioGuide.chapters).toHaveLength(5);
    expect(jingjuAudioGuide.cues).toHaveLength(25);
  });

  it("章节和文字稿时间点保持递增且相互对应", () => {
    jingjuAudioGuide.cues.forEach((cue, index) => {
      expect(cue.src).toMatch(/^audio\/guides\/jingju\/\d{3}\.m4a$/);
      expect(cue.durationSeconds).toBeCloseTo(cue.end - cue.start, 2);
      expect(cue.end).toBeGreaterThan(cue.start);
      if (index > 0) {
        expect(cue.start).toBeGreaterThanOrEqual(
          jingjuAudioGuide.cues[index - 1].end,
        );
      }
    });

    jingjuAudioGuide.chapters.forEach((chapter) => {
      const firstCue = jingjuAudioGuide.cues.find(
        ({ chapterId }) => chapterId === chapter.id,
      );
      expect(firstCue?.start).toBe(chapter.start);
    });
  });
});
