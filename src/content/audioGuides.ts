import rawJingjuGuide from "../../content/audio/jingju-three-minute-guide.json";
import rawTeaGuide from "../../content/audio/tea-three-minute-guide.json";
import { audioGuideSchema } from "./schema";

export const jingjuAudioGuide = audioGuideSchema.parse(rawJingjuGuide);
export const teaAudioGuide = audioGuideSchema.parse(rawTeaGuide);
