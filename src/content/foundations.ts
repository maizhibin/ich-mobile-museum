import rawFoundations from "../../content/exhibition-foundations.json";
import { exhibitionFoundationsSchema } from "./schema";

export const exhibitionFoundations =
  exhibitionFoundationsSchema.parse(rawFoundations);
export const getExhibitionFoundation = (id: string) =>
  exhibitionFoundations.find((item) => item.exhibitionId === id);
