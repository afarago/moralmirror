import { Character, TraitOption } from ".";
import { SeededRandom } from "../utils/SeededRandom";
import { englishNames, traitCategories } from "./consts";

/**
 * Character Generator utility class
 * Handles the generation of characters with weighted trait selection
 */
export class CharacterGenerator {
  constructor(public seededRandom: SeededRandom) {}

  /**
   * Weighted random selection function
   */
  private weightedRandomSelect<T extends { weight?: number }>(items: T[]): T {
    const totalWeight = items.reduce(
      (sum, item) => sum + (item.weight || 1),
      0
    );
    let random1 = this.seededRandom.random() * totalWeight;

    for (const item of items) {
      random1 -= item.weight || 1;
      if (random1 <= 0) {
        return item;
      }
    }

    return items[items.length - 1];
  }

  /**
   * Generate a description from selected traits
   */
  private generateDescription(traits: Record<string, TraitOption>): string {
    const traitEntries = Object.entries(traits);

    if (traitEntries.length === 0) {
      return "A person standing on the tracks.";
    }

    // Helper to determine "A" or "An"
    function addArticle(value: string, skipArticle?: boolean): string {
      if (skipArticle) return value;
      return /^[aeiou]/i.test(value.trim()) ? "An" : "A";
    }

    // Helper to strip leading articles (if any)
    function stripArticle(value: string): string {
      return value.replace(/^(a |an )/i, "");
    }

    // Helper to strip leading articles and generic words
    function removeGeneric(value: string):
      | {
          value: string;
          pronoun: string | undefined;
        }
      | undefined {
      // Remove "person/someone/individual" + optional "who"/"that"
      const match = value.match(
        /^(?<generic>person|someone|individual)(\s+(?<pronoun>who|that))?\s+/i
      );
      const { pronoun } = match?.groups ?? {};
      if (!match) return undefined;

      // if matched, replace
      value = value.replace(match[0], "");
      return { value, pronoun };
    }

    // Start with age if available, otherwise with first trait
    const age = traits["Age"];
    const occupation = traits["Occupation"];
    const leadingTrait = age || occupation;
    let description = "";

    // Construct the first part of the description, starting with capitalization
    if (leadingTrait) {
      description = `${addArticle(
        leadingTrait.value,
        leadingTrait.skipArticle
      )} ${stripArticle(leadingTrait.value)}`;
      if (age && occupation) {
        description += ` ${stripArticle(occupation.value)}`;
      }
    } else {
      description = "A person";
    }

    // Add remaining traits
    const remainingTraits = traitEntries.filter(
      ([key]) => key !== "Age" && key !== "Occupation"
    );

    if (remainingTraits.length > 0) {
      remainingTraits.forEach(([key, option], i) => {
        let skipArticle = traitCategories.find(
          (cat) => cat.name === key
        )?.skipArticle;

        const part = stripArticle(option.value);
        let descPart: string = part;
        const stripped = removeGeneric(descPart);
        if (stripped) {
          descPart = stripped.value; // Only strip leading articles if not already stripped
          skipArticle = true; // Skip article if we stripped leading words
        }

        if (!skipArticle) {
          descPart = `${addArticle(
            option.value,
            option.skipArticle
          ).toLowerCase()} ${option.value}`;
        } else {
          descPart = stripArticle(descPart);
        }

        if (i === 0) {
          description += ` ${stripped?.pronoun ?? "who is"} `;
        } else if (i > 0 && i === remainingTraits.length - 1) {
          description += " and ";
        } else if (i > 0) {
          description += ", ";
        }
        description += descPart;
      });
    }

    return description + ".";
  }

  /**
   * Generate a single character with random traits
   */
  public generateCharacter(): Character {
    const numTraits = Math.floor(this.seededRandom.random() * 7) + 3; // 3-7 traits
    const selectedCategories: Set<string> = new Set();
    const traits: Record<string, TraitOption> = {};

    // Select categories based on their weights
    while (
      selectedCategories.size < numTraits &&
      selectedCategories.size < traitCategories.length
    ) {
      const category = this.weightedRandomSelect(traitCategories);
      if (!selectedCategories.has(category.name)) {
        selectedCategories.add(category.name);
        const trait = this.weightedRandomSelect(category.options);
        traits[category.name] = trait;
      }
    }

    // Generate coherent description
    const description = this.generateDescription(traits);

    // Generate a random name from the list
    const name =
      englishNames[
        Math.floor(this.seededRandom.random() * englishNames.length)
      ];

    return { name, traits, description };
  }

  /**
   * Generate a pair of characters for the trolley problem scenario
   */
  public generateCharacterPair(): Character[] {
    const [characterA, characterB] = [
      this.generateCharacter(),
      this.generateCharacter(),
    ];

    // Ensure unique names
    while (characterB.name === characterA.name) {
      characterB.name =
        englishNames[
          Math.floor(this.seededRandom.random() * englishNames.length)
        ];
    }

    return [characterA, characterB];
  }
}
