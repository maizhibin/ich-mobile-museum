const readList = (key: string) => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) &&
      value.every((item) => typeof item === "string")
      ? value
      : [];
  } catch {
    return [];
  }
};

export const storage = {
  favorites: () => readList("heritage-favorites"),
  history: () => readList("heritage-history"),
  elderMode: () => localStorage.getItem("heritage-elder") === "true",
  writeList: (key: string, value: string[]) =>
    localStorage.setItem(key, JSON.stringify(value)),
  writeElderMode: (value: boolean) =>
    localStorage.setItem("heritage-elder", String(value)),
};
