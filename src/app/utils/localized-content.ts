export type LanguageCode = "vi" | "en";

export type LocalizedFields = Partial<Record<LanguageCode, Record<string, unknown>>>;

export function getLocalizedField<T extends object, K extends keyof T & string>(
  item: T & { translations?: LocalizedFields },
  language: LanguageCode,
  field: K
): T[K] {
  return (
    item.translations?.[language]?.[field] ||
    item.translations?.vi?.[field] ||
    item[field]
  ) as T[K];
}

export function getLocalizedText<T extends object>(
  item: T & { translations?: LocalizedFields },
  language: LanguageCode,
  field: keyof T & string
): string {
  const value = getLocalizedField(item, language, field);
  return typeof value === "string" ? value : "";
}
