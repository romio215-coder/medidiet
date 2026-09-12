import { FoodItem } from "../types/index";
export function parseNutrient(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const text = String(value).trim();
  if (!/^\d+(?:\.\d+)?$/.test(text)) return null;
  const number = Number(text);
  return Number.isFinite(number) && number >= 0 && number <= 100000
    ? number
    : null;
}
export function adaptMfdsItems(rows: unknown[]): FoodItem[] {
  const unique = new Map<string, FoodItem>();
  for (const raw of rows) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    if (typeof row.DESC_KOR !== "string" || !row.DESC_KOR.trim()) continue;
    const name = row.DESC_KOR.trim().slice(0, 160);
    const serving =
      typeof row.SERVING_SIZE === "string" ? row.SERVING_SIZE.trim() : "";
    const unit =
      typeof row.SERVING_UNIT === "string"
        ? row.SERVING_UNIT.trim().slice(0, 20)
        : "";
    const id =
      "mfds-" +
      JSON.stringify([
        String(row.FOOD_CD ?? "").slice(0, 100),
        name,
        serving.slice(0, 30),
        unit,
        ...Array.from({ length: 6 }, (_, i) =>
          parseNutrient(row[`NUTR_CONT${i + 1}`]),
        ),
      ]);
    unique.set(id, {
      id,
      name,
      nameKo: name,
      category: "Food database",
      categoryKo: "식품 DB",
      source: "mfds",
      // I2790 describes SERVING_SIZE as total contents, not a verified nutrition basis.
      // Do not assume grams or use it as a serving multiplier for the diary.
      serving: undefined,
      calories: parseNutrient(row.NUTR_CONT1),
      carbs: parseNutrient(row.NUTR_CONT2),
      protein: parseNutrient(row.NUTR_CONT3),
      fat: parseNutrient(row.NUTR_CONT4),
      sugar: parseNutrient(row.NUTR_CONT5),
      sodium: parseNutrient(row.NUTR_CONT6),
      potassium: null,
      giIndex: null,
    });
  }
  return [...unique.values()];
}
