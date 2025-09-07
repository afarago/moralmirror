import { PositionEnum } from "../types";
import { SeededRandom } from "../utils/SeededRandom";
import { CharacterGenerator } from "./CharacterGenerator";
import { englishNames, traitCategories } from "./consts";

describe("CharacterGenerator", () => {
  let seededRandom: SeededRandom;
  let generator: CharacterGenerator;

  beforeEach(() => {
    seededRandom = new SeededRandom("test-seed");
    generator = new CharacterGenerator(seededRandom);
  });

  it("generates a character with a name, traits, and description", () => {
    const character = generator.generateCharacter();
    expect(character).toHaveProperty("name");
    expect(character).toHaveProperty("traits");
    expect(character).toHaveProperty("description");
    expect(typeof character.name).toBe("string");
    expect(typeof character.description).toBe("string");
    expect(character.name.length).toBeGreaterThan(0);
    expect(Object.keys(character.traits).length).toBeGreaterThan(0);
    expect(englishNames).toContain(character.name);
  });

  it("generates a description that is a non-empty string", () => {
    const character = generator.generateCharacter();
    expect(typeof character.description).toBe("string");
    expect(character.description.length).toBeGreaterThan(0);
  });

  it("generates a character pair with different names", () => {
    const characters = generator.generateCharacterPair();
    expect(characters.length).toBe(2);
    expect(characters[PositionEnum.A].name).not.toBe(characters[PositionEnum.B].name);
    expect(characters[PositionEnum.A]).toHaveProperty("traits");
    expect(characters[PositionEnum.B]).toHaveProperty("traits");
  });

  it("selects traits from traitCategories", () => {
    const character = generator.generateCharacter();
    for (const key of Object.keys(character.traits)) {
      expect(traitCategories.map((tc) => tc.name)).toContain(key);
    }
  });

  it("description starts with an article or 'A person'", () => {
    const character = generator.generateCharacter();
    expect(
      character.description.startsWith("A ") ||
        character.description.startsWith("An ") ||
        character.description.startsWith("A person")
    ).toBe(true);
  });

  it("weightedRandomSelect respects weights", () => {
    const options = [
      { name: "Common", weight: 80 },
      { name: "Uncommon", weight: 15 },

      { name: "Rare", weight: 5 },
    ];
    const counts: Record<string, number> = { Common: 0, Uncommon: 0, Rare: 0 };
    const trials = 10000;
    for (let i = 0; i < trials; i++) {
      const selected = generator["weightedRandomSelect"](options);
      counts[selected.name]++;
    }
    // Common should be selected most often, Rare least often
    expect(counts["Common"]).toBeGreaterThan(counts["Uncommon"]);
    expect(counts["Uncommon"]).toBeGreaterThan(counts["Rare"]);
    // Roughly check proportions (not too strict due to randomness)
    expect(counts["Common"]).toBeGreaterThan(trials * 0.6);
    expect(counts["Rare"]).toBeLessThan(trials * 0.1);
  });
});
