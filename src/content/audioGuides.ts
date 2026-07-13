import rawJingjuGuide from "../../content/audio/jingju-three-minute-guide.json";
import { audioGuideSchema } from "./schema";

export const jingjuAudioGuide = audioGuideSchema.parse(rawJingjuGuide);
