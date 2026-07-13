import rawMuseums from "../../content/museums.json";
import rawElements from "../../content/unesco-elements.json";
import { museumsSchema, unescoElementsSchema } from "./schema";

export const unescoElements = unescoElementsSchema.parse(rawElements);
export const museums = museumsSchema.parse(rawMuseums);
export const unescoSourceUrl = "https://www.ihchina.cn/chinadirectory.html";

export const listTypeLabels = {
  REPRESENTATIVE: "人类非遗代表作",
  URGENT_SAFEGUARDING: "急需保护",
  GOOD_PRACTICE: "优秀保护实践",
} as const;

export const getMuseum = (id: string) =>
  museums.find((museum) => museum.id === id);
export const getMuseumElements = (id: string) =>
  unescoElements.filter((element) => element.museums.includes(id));
