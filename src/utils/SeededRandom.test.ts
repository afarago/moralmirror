import { SeededRandom } from "./SeededRandom";

describe("SeededRandom", () => {
  it("produces deterministic output for the same seed", () => {
    const rng1 = new SeededRandom("abc");
    const rng2 = new SeededRandom("abc");
    expect(rng1.random()).toBeCloseTo(rng2.random());
    expect(rng1.random()).toBeCloseTo(rng2.random());
  });

  it("serializes and restores state correctly", () => {
    const rng = new SeededRandom("xyz");
    // Generate some random values to consume steps
    for (let i = 0; i < 5; i++) rng.random();

    const stateStr = rng.getCompactStateString();
    // const restoredState = SeededRandom.decodeCompactState(stateStr);
    const restored = new SeededRandom(stateStr);

    // Should continue sequence
    expect(restored.random()).toBeCloseTo(rng.random());
    expect(restored.getCompactState()).toEqual(rng.getCompactState());
  });

  it("getCompactStateString and decodeCompactState are inverses", () => {
    const rng = new SeededRandom("test");
    for (let i = 0; i < 7; i++) rng.random();
    const str = rng.getCompactStateString();
    const decoded = SeededRandom.decodeCompactState(str);
    expect(decoded.seed).toBe("test");
    expect(decoded.step).toBe(7);
  });
});
