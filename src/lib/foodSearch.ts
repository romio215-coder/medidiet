import { adaptMfdsItems } from "../data/apiAdapter";

export async function searchFoods(
  endpoint: string,
  query: string,
  signal: AbortSignal,
) {
  const url = new URL(endpoint);
  if (url.protocol !== "https:") throw new Error("HTTPS required");
  url.searchParams.set("q", query);
  const response = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
    headers: { Accept: "application/json" },
    credentials: "omit",
    referrerPolicy: "no-referrer",
  });
  if (!response.ok) throw new Error("Search unavailable");
  const data = await response.json();
  if (!Array.isArray(data.items)) throw new Error("Invalid response");
  return adaptMfdsItems(data.items.slice(0, 100));
}
