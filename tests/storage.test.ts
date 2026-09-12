import { test } from "node:test";
import assert from "node:assert/strict";
import { useUserStore as store } from "../src/store/userStore";
const key = "medidiet-v2";
function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => map.set(k, v),
    removeItem: (k: string) => map.delete(k),
    clear: () => map.clear(),
    key: () => null,
    get length() {
      return map.size;
    },
  };
}
test("consent controls storage; refresh restores records; reset clears both stores", () => {
  Object.defineProperty(globalThis, "localStorage", {
    value: memoryStorage(),
    configurable: true,
  });
  Object.defineProperty(globalThis, "sessionStorage", {
    value: memoryStorage(),
    configurable: true,
  });
  store.getState().hydrate();
  store.getState().setProfile({ name: "Fixture" });
  store.getState().completeSetup();
  assert.equal(localStorage.getItem(key), null);
  assert.ok(sessionStorage.getItem(key));
  store.getState().setRemember(true);
  assert.ok(localStorage.getItem(key));
  assert.equal(sessionStorage.getItem(key), null);
  store.setState({ ready: false });
  store.getState().hydrate();
  assert.equal(store.getState().profile.name, "Fixture");
  assert.equal(store.getState().remember, true);
  store.getState().resetProfile();
  assert.equal(localStorage.getItem(key), null);
  assert.equal(sessionStorage.getItem(key), null);
});
test("corrupt saved data is not silently overwritten", () => {
  localStorage.setItem(key, "broken");
  store.setState({ ready: false });
  store.getState().hydrate();
  assert.equal(store.getState().storageError, true);
  assert.equal(localStorage.getItem(key), "broken");
  store.getState().resetProfile();
  assert.equal(localStorage.getItem(key), null);
});
