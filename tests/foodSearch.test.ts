import { test } from "node:test";
import assert from "node:assert/strict";
import { searchFoods, SearchError } from "../src/lib/foodSearch";
test("search caches results, limits rapid requests and honors provider throttling", async (t) => {
  let now = 100000,
    calls = 0;
  t.mock.method(Date, "now", () => now);
  t.mock.method(globalThis, "fetch", async (input: URL) => {
    calls++;
    assert.equal(input.hostname, "world.openfoodfacts.org");
    assert.equal(
      input.searchParams.get("User-Agent"),
      "MediDiet/0.2 (https://github.com/romio215-coder/medidiet)",
    );
    return calls === 1
      ? Response.json({
          products: [
            {
              code: "12345678",
              product_name: "Fixture",
              nutriments: { "energy-kcal_100g": 100 },
            },
          ],
        })
      : new Response("", { status: 429 });
  });
  const signal = new AbortController().signal;
  assert.equal((await searchFoods("", "milk", signal)).length, 1);
  assert.equal((await searchFoods("", "milk", signal)).length, 1);
  assert.equal(calls, 1);
  await assert.rejects(
    searchFoods("", "rice", signal),
    (e) => e instanceof SearchError && e.code === "RATE_LIMIT",
  );
  now += 8000;
  await assert.rejects(
    searchFoods("", "rice", signal),
    (e) => e instanceof SearchError && e.code === "RATE_LIMIT",
  );
  now += 10000;
  await assert.rejects(
    searchFoods("", "rice", signal),
    (e) => e instanceof SearchError && e.code === "RATE_LIMIT",
  );
  assert.equal(calls, 2);
});
