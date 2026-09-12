import { FoodItem, MealEntry, nutrientKeys, UserProfile } from "../types/index";
const diseases = ["DM", "HTN", "DYS", "CKD", "OBESITY", "COLORECTAL"];
export function validDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function validProfile(raw: unknown): raw is UserProfile {
  if (!raw || typeof raw !== "object") return false;
  const p = raw as UserProfile;
  return (
    typeof p.name === "string" &&
    p.name.trim().length > 0 &&
    p.name.length <= 40 &&
    Array.isArray(p.diseases) &&
    p.diseases.length <= 6 &&
    p.diseases.every((d) => diseases.includes(d)) &&
    (p.limits === undefined ||
      (!!p.limits &&
        typeof p.limits === "object" &&
        Object.entries(p.limits).every(
          ([k, v]) =>
            nutrientKeys.includes(k as (typeof nutrientKeys)[number]) &&
            typeof v === "number" &&
            Number.isFinite(v) &&
            v > 0 &&
            v <= 100000,
        )))
  );
}
export function validFood(raw: unknown): raw is FoodItem {
  if (!raw || typeof raw !== "object") return false;
  const f = raw as FoodItem;
  return (
    typeof f.id === "string" &&
    f.id.length <= 2000 &&
    typeof f.name === "string" &&
    f.name.length > 0 &&
    f.name.length <= 160 &&
    typeof f.category === "string" &&
    ["example", "mfds", "manual", "openfoodfacts"].includes(f.source || "") &&
    (f.sourceUrl === undefined ||
      (typeof f.sourceUrl === "string" &&
        /^https:\/\/world\.openfoodfacts\.org\/product\/\d+$/.test(
          f.sourceUrl,
        ))) &&
    (f.nameKo === undefined ||
      (typeof f.nameKo === "string" && f.nameKo.length <= 160)) &&
    (f.categoryKo === undefined || typeof f.categoryKo === "string") &&
    (f.giIndex === null || ["Low", "Medium", "High"].includes(f.giIndex)) &&
    (f.serving === undefined ||
      (typeof f.serving === "string" && f.serving.length <= 100)) &&
    nutrientKeys.every(
      (k) =>
        f[k] === null ||
        (typeof f[k] === "number" &&
          Number.isFinite(f[k]) &&
          f[k]! >= 0 &&
          f[k]! <= 100000),
    )
  );
}
export function validEntry(raw: unknown): raw is MealEntry {
  if (!raw || typeof raw !== "object") return false;
  const e = raw as MealEntry;
  return (
    typeof e.id === "string" &&
    e.id.length <= 100 &&
    validDate(e.date) &&
    ["breakfast", "lunch", "dinner", "snack"].includes(e.slot) &&
    typeof e.portions === "number" &&
    Number.isFinite(e.portions) &&
    e.portions > 0 &&
    e.portions <= 20 &&
    validFood(e.food) &&
    e.food.source !== "example" &&
    typeof e.food.serving === "string" &&
    e.food.serving.trim().length > 0
  );
}
