import { test } from "node:test";
import assert from "node:assert/strict";
import { adaptOpenFoodFacts } from "../src/data/openFoodFacts";
import { validEntry } from "../src/lib/validation";
test("OFF conversion uses normalized grams and preserves missing nutrients", () => {
  const [food] = adaptOpenFoodFacts([
    {
      code: "8801121752197",
      product_name: "Fixture",
      nutrition_data_per: "100ml",
      nutriments: {
        "energy-kcal_100g": 40,
        sodium_100g: 0.04,
        potassium_100g: 0.15,
        carbohydrates_100g: 3,
        sugars_100g: 0,
      },
    },
  ]);
  assert.equal(food.sodium, 40);
  assert.equal(food.potassium, 150);
  assert.equal(food.sugar, 0);
  assert.equal(food.protein, null);
  assert.equal(food.calories, 40);
  assert.equal(food.serving, "100 ml");
  assert.ok(
    validEntry({
      id: "e",
      date: "2026-09-12",
      slot: "lunch",
      food,
      portions: 2,
    }),
  );
});
test("OFF incomplete/qualified data and duplicate records are handled without fabricated values", () => {
  const p = {
    code: "12345678",
    product_name: "Fixture",
    nutriments: {
      sodium_100g: 0.1,
      sodium_modifier: "<",
      "energy-kj_100g": 200,
    },
  };
  const rows = adaptOpenFoodFacts([
    p,
    p,
    null,
    { code: "../unsafe", product_name: "x" },
  ]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].sodium, null);
  assert.equal(rows[0].calories, null);
  assert.equal(rows[0].serving, undefined);
});
