import rawExhibitions from "../../content/exhibitions.json";
import { exhibitionsSchema } from "./schema";

export const exhibitions = exhibitionsSchema.parse(rawExhibitions);

export const getExhibition = (id: string) =>
  exhibitions.find((item) => item.id === id);
