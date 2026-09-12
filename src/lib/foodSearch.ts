import { adaptMfdsItems } from "../data/apiAdapter";
import { adaptOpenFoodFacts } from "../data/openFoodFacts";
import { FoodItem } from "../types";

export const mfdsProxy = process.env.NEXT_PUBLIC_MFDS_PROXY_URL?.trim() || "";
export const foodProvider = mfdsProxy ? "mfds" : "openfoodfacts";
export class SearchError extends Error {
  constructor(public code: "RATE_LIMIT" | "UNAVAILABLE" | "INVALID_RESPONSE") {
    super(code);
  }
}
const cache = new Map<string, { at: number; foods: FoodItem[] }>();
let nextRequestAt = 0;
export async function searchFoods(
  endpoint: string,
  query: string,
  signal: AbortSignal,
): Promise<FoodItem[]> {
  const q = query.trim();
  if (q.length < 2 || q.length > 60) return [];
  const key = endpoint + "|" + q.toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < 300000) return cached.foods;
  if (Date.now() < nextRequestAt) throw new SearchError("RATE_LIMIT");
  nextRequestAt = Date.now() + 7000;
  const url = new URL(
    endpoint || "https://world.openfoodfacts.org/cgi/search.pl",
  );
  if (url.protocol !== "https:") throw new SearchError("UNAVAILABLE");
  if (endpoint) url.searchParams.set("q", q);
  else {
    const params = {
      search_terms: q,
      search_simple: "1",
      action: "process",
      json: "1",
      page_size: "20",
      fields:
        "code,product_name,product_name_ko,product_name_en,nutriments,nutrition_data_per",
      "User-Agent": "MediDiet/0.2 (https://github.com/romio215-coder/medidiet)",
    };
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const response = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]),
    headers: { Accept: "application/json" },
    credentials: "omit",
    referrerPolicy: "no-referrer",
  });
  if (response.status === 429) {
    nextRequestAt = Date.now() + 60000;
    throw new SearchError("RATE_LIMIT");
  }
  if (!response.ok) throw new SearchError("UNAVAILABLE");
  const data = await response.json();
  const rows = endpoint ? data.items : data.products;
  if (!Array.isArray(rows)) throw new SearchError("INVALID_RESPONSE");
  const foods = endpoint
    ? adaptMfdsItems(rows.slice(0, 20))
    : adaptOpenFoodFacts(rows.slice(0, 20));
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  if (cache.size >= 30) cache.delete(cache.keys().next().value!);
  cache.set(key, { at: Date.now(), foods });
  return foods;
}
