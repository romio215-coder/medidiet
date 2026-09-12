import { test } from "node:test";
import assert from "node:assert/strict";
import { parseNutrient, adaptMfdsItems } from "../src/data/apiAdapter";
import {
  calculateTotals,
  getRecommendedMeals,
  localDate,
} from "../src/lib/nutritionAlgorithm";
import { validEntry, validFood, validDate } from "../src/lib/validation";
import { FoodItem, MealEntry, UserProfile } from "../src/types";

const food: FoodItem = {
  id: "f",
  name: "Milk",
  category: "Dairy",
  source: "manual",
  serving: "1 pack (200 ml)",
  calories: 100,
  carbs: 10,
  protein: 8,
  fat: 3,
  sodium: 0,
  potassium: null,
  sugar: 10,
  giIndex: null,
};
const profile: UserProfile = {
  name: "Test",
  age: "",
  gender: "Male",
  height: "",
  weight: "",
  diseases: [],
  biometrics: {},
  limits: {},
};
const entry: MealEntry = {
  id: "e",
  date: "2026-09-11",
  slot: "breakfast",
  food,
  portions: 0.5,
};

test("missing, invalid and qualified nutrients never become zero", () => {
  for (const v of [
    undefined,
    null,
    "",
    "N/A",
    "-",
    "<0.1",
    "2 g",
    -1,
    Infinity,
    {},
    100001,
  ])
    assert.equal(parseNutrient(v), null);
  assert.equal(parseNutrient("0"), 0);
  assert.equal(parseNutrient(" 1.25 "), 1.25);
});
test("food identifiers are stable and distinguish records; total contents is not a serving assumption", () => {
  const raw = {
    DESC_KOR: "우유",
    FOOD_CD: "123",
    SERVING_SIZE: "200",
    SERVING_UNIT: "ml",
    NUTR_CONT1: "100",
  };
  const a = adaptMfdsItems([raw, raw, { ...raw, NUTR_CONT1: "120" }, null]);
  assert.equal(a.length, 2);
  assert.equal(a[0].id, adaptMfdsItems([raw])[0].id);
  assert.equal(a[0].sodium, null);
  assert.equal(a[0].serving, undefined);
  assert.equal(a[0].giIndex, null);
});
test("fractional portions sum known nutrients and track incomplete totals", () => {
  const result = calculateTotals([
    entry,
    { ...entry, id: "e2", portions: 2, food: { ...food, calories: null } },
  ]);
  assert.deepEqual(result.calories, { value: 50, missing: 1 });
  assert.deepEqual(result.sodium, { value: 0, missing: 0 });
  assert.deepEqual(result.potassium, { value: 0, missing: 2 });
  assert.equal(calculateTotals([]).calories.value, 0);
});
test("missing data never hides an explicit user limit violation or implies medical safety", () => {
  const result = getRecommendedMeals(
    { ...profile, diseases: ["CKD", "DM"], limits: { calories: 90 } },
    [food],
  )[0];
  assert.equal(result.status, "INCOMPLETE");
  for (const r of ["MISSING_DATA", "ABOVE_DAILY_LIMIT", "KIDNEY_REVIEW"])
    assert.ok(result.reasons.includes(r));
  assert.equal(
    getRecommendedMeals(profile, [{ ...food, potassium: 1 }])[0].status,
    "INFO",
  );
});
test("invalid dates, examples, unverified servings and corrupt labels cannot enter diary", () => {
  assert.ok(validEntry(entry));
  assert.ok(!validDate("2026-02-30"));
  assert.ok(validDate("2024-02-29"));
  assert.ok(!validEntry({ ...entry, portions: 0 }));
  assert.ok(!validEntry({ ...entry, portions: 21 }));
  assert.ok(!validEntry({ ...entry, food: { ...food, source: "example" } }));
  assert.ok(!validEntry({ ...entry, food: { ...food, serving: undefined } }));
  assert.ok(!validFood({ ...food, nameKo: {} }));
  assert.equal(localDate(new Date(2026, 0, 2, 0, 1)), "2026-01-02");
});
