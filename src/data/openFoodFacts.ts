import { FoodItem, nutrientKeys } from "../types";
import { parseNutrient } from "./apiAdapter";

// OFF normalizes mass nutrients to grams, including sodium and potassium.
// _100g denotes 100 g or 100 ml for liquids; the label must confirm the basis.
export function adaptOpenFoodFacts(products: unknown[]): FoodItem[] {
  const results = new Map<string, FoodItem>();
  for (const value of products) {
    if (!value || typeof value !== "object") continue;
    const p = value as Record<string, unknown>;
    const code = String(p.code ?? "");
    if (!/^\d{4,24}$/.test(code)) continue;
    const text = (v: unknown) =>
      typeof v === "string" ? v.trim().slice(0, 160) : "";
    const name =
      text(p.product_name) ||
      text(p.product_name_ko) ||
      text(p.product_name_en);
    if (!name) continue;
    const n =
      p.nutriments && typeof p.nutriments === "object"
        ? (p.nutriments as Record<string, unknown>)
        : {};
    const nutrient = (key: string, multiplier = 1) => {
      if (n[`${key}_modifier`] || n[`${key}_100g_modifier`]) return null;
      const v = parseNutrient(n[`${key}_100g`]);
      return v === null || v * multiplier > 100000 ? null : v * multiplier;
    };
    const food: FoodItem = {
      id: `off-${code}`,
      name,
      nameKo: text(p.product_name_ko) || name,
      category: "Packaged food",
      categoryKo: "포장 식품",
      source: "openfoodfacts",
      sourceUrl: `https://world.openfoodfacts.org/product/${code}`,
      giIndex: null,
      serving:
        p.nutrition_data_per === "100ml"
          ? "100 ml"
          : p.nutrition_data_per === "100g"
            ? "100 g"
            : "100 g / 100 ml",
      calories: nutrient("energy-kcal"),
      carbs: nutrient("carbohydrates"),
      protein: nutrient("proteins"),
      fat: nutrient("fat"),
      sodium: nutrient("sodium", 1000),
      potassium: nutrient("potassium", 1000),
      sugar: nutrient("sugars"),
    };
    if (nutrientKeys.every((k) => food[k] === null)) food.serving = undefined;
    results.set(food.id, food);
  }
  return [...results.values()];
}
