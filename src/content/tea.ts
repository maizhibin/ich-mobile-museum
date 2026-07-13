import rawTeaExhibition from "../../content/tea-exhibition.json";
import { teaExhibitionSchema } from "./schema";

export const teaExhibition = teaExhibitionSchema.parse(rawTeaExhibition);
