import {
  FoodItem,
  MealEntry,
  MealRecommendation,
  nutrientKeys,
  NutrientKey,
  UserProfile,
} from "../types/index";
export function validNutrient(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
export function getRecommendedMeals(
  user: UserProfile,
  foods: FoodItem[],
): MealRecommendation[] {
  return foods.map((food) => {
    const reasons: string[] = [];
    const missing = nutrientKeys.some((key) => !validNutrient(food[key]));
    if (missing) reasons.push("MISSING_DATA");
    if (food.source === "example" || !food.source) reasons.push("EXAMPLE_DATA");
    if (user.diseases.length) reasons.push("INDIVIDUAL_REVIEW");
    if (user.diseases.includes("CKD")) reasons.push("KIDNEY_REVIEW");
    const exceeds = !!food.serving && nutrientKeys.some(
      (key) =>
        validNutrient(food[key]) &&
        validNutrient(user.limits?.[key]) &&
        food[key]! > user.limits![key]!,
    );
    if (exceeds) reasons.push("ABOVE_DAILY_LIMIT");
    return {
      food,
      status:
        missing || food.source === "example" || !food.source
          ? "INCOMPLETE"
          : exceeds || user.diseases.length
            ? "REVIEW"
            : "INFO",
      reasons,
    };
  });
}
export function calculateTotals(entries: MealEntry[]) {
  return Object.fromEntries(
    nutrientKeys.map((key) => {
      const known = entries.filter((entry) => validNutrient(entry.food[key]));
      return [
        key,
        {
          value: known.reduce(
            (sum, entry) => sum + entry.food[key]! * entry.portions,
            0,
          ),
          missing: entries.length - known.length,
        },
      ];
    }),
  ) as Record<NutrientKey, { value: number; missing: number }>;
}
export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
