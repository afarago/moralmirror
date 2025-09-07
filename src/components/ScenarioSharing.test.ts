import { SeededRandom } from "../utils/SeededRandom";

describe("Scenario sharing/restoration", () => {
  it("restores the exact PRNG state from a shared URL", () => {
    const rng = new SeededRandom("share-seed");
    for (let i = 0; i < 10; i++) rng.random();
    const stateStr = rng.getCompactStateString();
    const url = createShareUrl(stateStr);

    const restored = restoreFromUrl(url);
    expect(restored.seed).toBe("share-seed");
    expect(restored.step).toBe(10);
    // Should continue sequence
    expect(restored.random()).toBeCloseTo(rng.random());
  });

  it("restores from a compact state with step 0", () => {
    const rng = new SeededRandom("zero-step");
    const stateStr = rng.getCompactStateString();
    const url = createShareUrl(stateStr);

    const restored = restoreFromUrl(url);
    expect(restored.seed).toBe("zero-step");
    expect(restored.step).toBe(0);
    expect(restored.random()).toBeCloseTo(rng.random());
  });

  it("restores from a URL with additional unrelated parameters", () => {
    const rng = new SeededRandom("extra-param");
    rng.random();
    const stateStr = rng.getCompactStateString();
    const url = `/play?foo=bar&seed=${encodeURIComponent(stateStr)}&baz=qux`;

    const restored = restoreFromUrl(url);
    expect(restored.seed).toBe("extra-param");
    expect(restored.step).toBe(1);
    expect(restored.random()).toBeCloseTo(rng.random());
  });

  it("restores correctly from a URL-encoded seed", () => {
    const rng = new SeededRandom("special chars !@#$%^&*()");
    for (let i = 0; i < 3; i++) rng.random();
    const stateStr = rng.getCompactStateString();
    const url = createShareUrl(stateStr);

    const restored = restoreFromUrl(url);
    expect(restored.seed).toBe("special chars !@#$%^&*()");
    expect(restored.step).toBe(3);
    expect(restored.random()).toBeCloseTo(rng.random());
  });
});

// Simulate scenario sharing via URL
function createShareUrl(stateString: string) {
  return `/play?seed=${encodeURIComponent(stateString)}`;
}

function restoreFromUrl(url: string) {
  const params = new URLSearchParams(url.split("?")[1]);
  const seedParam = params.get("seed");
  return new SeededRandom(seedParam || undefined);
}
