// src/character-generator/CharacterGenerator.ts

// Type definitions
export interface TraitOption {
  value: string;
  weight?: number;
}

export interface TraitCategory {
  name: string;
  weight: number;
  options: TraitOption[];
}

export interface Character {
  traits: { [key: string]: string };
  description: string;
}

// Comprehensive trait data structure
const traitCategories: TraitCategory[] = [
  {
    name: 'Age',
    weight: 7,
    options: [
      { value: '8-year-old' },
      { value: '15-year-old' },
      { value: '22-year-old' },
      { value: '35-year-old' },
      { value: '45-year-old' },
      { value: '67-year-old' },
      { value: '78-year-old' },
      { value: 'elderly 82-year-old' },
      { value: 'young 19-year-old' },
      { value: 'middle-aged 52-year-old' }
    ]
  },
  {
    name: 'Occupation',
    weight: 6,
    options: [
      { value: 'doctor' },
      { value: 'teacher' },
      { value: 'construction worker' },
      { value: 'nurse' },
      { value: 'firefighter' },
      { value: 'artist' },
      { value: 'engineer' },
      { value: 'chef' },
      { value: 'social worker' },
      { value: 'mechanic' },
      { value: 'librarian' },
      { value: 'farmer' },
      { value: 'scientist' },
      { value: 'retail worker' },
      { value: 'unemployed person' },
      { value: 'retired person' },
      { value: 'student' }
    ]
  },
  {
    name: 'Family Status',
    weight: 6,
    options: [
      { value: 'devoted parent of three children' },
      { value: 'single parent struggling to make ends meet' },
      { value: 'loving grandparent' },
      { value: 'expecting parent' },
      { value: 'orphan with no living relatives' },
      { value: 'caregiver for elderly parents' },
      { value: 'eldest sibling supporting younger family members' },
      { value: 'person with no close family ties' },
      { value: 'recently married newlywed' },
      { value: 'widow/widower living alone' }
    ]
  },
  {
    name: 'Health Status',
    weight: 5,
    options: [
      { value: 'person battling terminal cancer' },
      { value: 'healthy individual in peak physical condition' },
      { value: 'person with a disability who lives independently' },
      { value: 'recovering from a major surgery' },
      { value: 'person with chronic but manageable diabetes' },
      { value: 'someone dealing with depression' },
      { value: 'person who recently overcame addiction' },
      { value: 'individual with excellent mental health' },
      { value: 'person requiring regular medical treatment' },
      { value: 'someone with a rare genetic condition' }
    ]
  },
  {
    name: 'Community Role',
    weight: 4,
    options: [
      { value: 'respected community leader' },
      { value: 'volunteer at local homeless shelter' },
      { value: 'youth mentor and coach' },
      { value: 'neighborhood watch coordinator' },
      { value: 'person known for helping others' },
      { value: 'local activist fighting for social justice' },
      { value: 'someone who keeps to themselves' },
      { value: 'pillar of the local religious community' },
      { value: 'organizer of community events' },
      { value: 'person struggling with social connections' }
    ]
  },
  {
    name: 'Moral Standing',
    weight: 4,
    options: [
      { value: 'person known for unwavering honesty' },
      { value: 'individual who has made serious mistakes but learned from them' },
      { value: 'someone who always puts others before themselves' },
      { value: 'person with a complicated moral history' },
      { value: 'individual admired for their integrity' },
      { value: 'someone working to make amends for past wrongs' },
      { value: 'person who struggles with ethical decisions' },
      { value: 'individual known for their compassion' },
      { value: 'someone who stands up for what\'s right' },
      { value: 'person trying to turn their life around' }
    ]
  },
  {
    name: 'Financial Standing',
    weight: 3,
    options: [
      { value: 'wealthy philanthropist' },
      { value: 'person living paycheck to paycheck' },
      { value: 'financially stable middle-class individual' },
      { value: 'someone experiencing homelessness' },
      { value: 'person who recently lost their home' },
      { value: 'individual with significant debt' },
      { value: 'person who donates regularly to charity' },
      { value: 'someone saving for their children\'s future' },
      { value: 'individual struggling with poverty' },
      { value: 'person with modest but secure means' }
    ]
  },
  {
    name: 'Education',
    weight: 3,
    options: [
      { value: 'PhD holder researching climate solutions' },
      { value: 'high school dropout with street wisdom' },
      { value: 'recent college graduate' },
      { value: 'self-taught expert in their field' },
      { value: 'person currently pursuing their GED' },
      { value: 'skilled tradesperson with years of experience' },
      { value: 'lifelong learner despite limited formal education' },
      { value: 'university professor' },
      { value: 'person with specialized technical training' },
      { value: 'individual who values practical knowledge' }
    ]
  },
  {
    name: 'Personality',
    weight: 3,
    options: [
      { value: 'naturally optimistic and cheerful person' },
      { value: 'quiet, thoughtful individual' },
      { value: 'someone with an infectious laugh' },
      { value: 'person who tends to worry excessively' },
      { value: 'individual known for their quick wit' },
      { value: 'someone who is incredibly patient' },
      { value: 'person with a fiery temper but good heart' },
      { value: 'naturally empathetic individual' },
      { value: 'someone who is socially awkward but kind' },
      { value: 'person with remarkable resilience' }
    ]
  },
  {
    name: 'Past Accomplishments',
    weight: 2,
    options: [
      { value: 'former Olympic athlete' },
      { value: 'person who saved lives during a natural disaster' },
      { value: 'individual who overcame significant childhood trauma' },
      { value: 'someone who built a successful business from nothing' },
      { value: 'person who served their country in the military' },
      { value: 'individual who invented something beneficial to society' },
      { value: 'someone who raised millions for charity' },
      { value: 'person who mentored countless young people' },
      { value: 'individual who survived a life-threatening illness' },
      { value: 'someone who made significant scientific discoveries' }
    ]
  },
  {
    name: 'Future Potential',
    weight: 2,
    options: [
      { value: 'aspiring to become a doctor' },
      { value: 'planning to start a family next year' },
      { value: 'about to launch a nonprofit organization' },
      { value: 'working toward a cure for a rare disease' },
      { value: 'hoping to reconcile with estranged family' },
      { value: 'planning to retire and travel the world' },
      { value: 'studying to become a teacher' },
      { value: 'working on a novel that could inspire others' },
      { value: 'training for an important competition' },
      { value: 'preparing to adopt children in need' }
    ]
  },
  {
    name: 'Dependents',
    weight: 2,
    options: [
      { value: 'sole caregiver for disabled spouse' },
      { value: 'person supporting elderly parents financially' },
      { value: 'guardian of three young nephews' },
      { value: 'caregiver for special needs child' },
      { value: 'person caring for terminally ill partner' },
      { value: 'foster parent to multiple children' },
      { value: 'individual with no dependents' },
      { value: 'caregiver for aging grandparents' },
      { value: 'person supporting unemployed family members' },
      { value: 'single guardian of younger siblings' }
    ]
  },
  {
    name: 'Relationship Status',
    weight: 1,
    options: [
      { value: 'happily married for 25 years' },
      { value: 'recently divorced and rebuilding life' },
      { value: 'in a loving relationship of 5 years' },
      { value: 'single and content with independence' },
      { value: 'widowed after losing spouse last year' },
      { value: 'engaged to be married next month' },
      { value: 'separated and working on reconciliation' },
      { value: 'single parent dating again' },
      { value: 'married but struggling with relationship' },
      { value: 'lifelong bachelor/bachelorette by choice' }
    ]
  },
  {
    name: 'Criminal History',
    weight: 1,
    options: [
      { value: 'person with a clean criminal record' },
      { value: 'former convict who has turned life around' },
      { value: 'individual with minor past legal troubles' },
      { value: 'someone who served time for white-collar crime' },
      { value: 'person wrongly convicted but later exonerated' },
      { value: 'individual with drunk driving conviction from youth' },
      { value: 'former gang member now working with at-risk youth' },
      { value: 'person who spent years in prison but has reformed' },
      { value: 'individual with history of civil disobedience for causes' },
      { value: 'someone with juvenile record who became successful' }
    ]
  },
  {
    name: 'Special Circumstance',
    weight: 1,
    options: [
      { value: 'person who just received life-changing news' },
      { value: 'individual celebrating their wedding anniversary today' },
      { value: 'someone rushing to donate bone marrow to save a life' },
      { value: 'person carrying the cure for a deadly disease' },
      { value: 'individual who just lost their job this morning' },
      { value: 'someone on their way to adopt a child' },
      { value: 'person carrying important evidence of corruption' },
      { value: 'individual who just learned they\'re going to be a grandparent' },
      { value: 'someone returning from visiting dying parent' },
      { value: 'person who just graduated after years of study' }
    ]
  }
];

/**
 * Character Generator utility class
 * Handles the generation of characters with weighted trait selection
 */
export class CharacterGenerator {
  /**
   * Weighted random selection function
   */
  private static weightedRandomSelect<T extends { weight?: number }>(items: T[]): T {
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
      random -= (item.weight || 1);
      if (random <= 0) {
        return item;
      }
    }
    
    return items[items.length - 1];
  }

  /**
   * Generate a description from selected traits
   */
  private static generateDescription(traits: { [key: string]: string }): string {
    const traitEntries = Object.entries(traits);
    
    if (traitEntries.length === 0) {
      return "A person standing on the tracks.";
    }
    
    // Start with age if available, otherwise with first trait
    let description = "";
    const ageEntry = traitEntries.find(([key]) => key === "Age");
    const occupationEntry = traitEntries.find(([key]) => key === "Occupation");
    
    if (ageEntry && occupationEntry) {
      description = `A ${ageEntry[1]} ${occupationEntry[1]}`;
    } else if (ageEntry) {
      description = `A ${ageEntry[1]}`;
    } else if (occupationEntry) {
      description = `A ${occupationEntry[1]}`;
    } else {
      description = `A person`;
    }
    
    // Add remaining traits
    const remainingTraits = traitEntries.filter(([key]) => 
      key !== "Age" && key !== "Occupation"
    );
    
    if (remainingTraits.length > 0) {
      const traitDescriptions = remainingTraits.map(([_, value]) => value);
      
      if (traitDescriptions.length === 1) {
        description += ` who is ${traitDescriptions[0]}`;
      } else if (traitDescriptions.length === 2) {
        description += ` who is ${traitDescriptions[0]} and ${traitDescriptions[1]}`;
      } else {
        const lastTrait = traitDescriptions.pop();
        description += ` who is ${traitDescriptions.join(", ")}, and ${lastTrait}`;
      }
    }
    
    return description + ".";
  }

  /**
   * Generate a single character with random traits
   */
  public static generateCharacter(): Character {
    const numTraits = Math.floor(Math.random() * 3) + 3; // 3-5 traits
    const selectedCategories: Set<string> = new Set();
    const traits: { [key: string]: string } = {};
    
    // Select categories based on their weights
    while (selectedCategories.size < numTraits && selectedCategories.size < traitCategories.length) {
      const category = this.weightedRandomSelect(traitCategories);
      if (!selectedCategories.has(category.name)) {
        selectedCategories.add(category.name);
        const trait = this.weightedRandomSelect(category.options);
        traits[category.name] = trait.value;
      }
    }
    
    // Generate coherent description
    const description = this.generateDescription(traits);
    
    return { traits, description };
  }

  /**
   * Generate a pair of characters for the trolley problem scenario
   */
  public static generateCharacterPair(): { characterA: Character; characterB: Character } {
    return {
      characterA: this.generateCharacter(),
      characterB: this.generateCharacter()
    };
  }

  /**
   * Get available trait categories (for debugging or UI purposes)
   */
  public static getTraitCategories(): TraitCategory[] {
    return [...traitCategories];
  }

  /**
   * Get total number of possible trait combinations
   */
  public static getTotalCombinations(): number {
    return traitCategories.reduce((total, category) => total * category.options.length, 1);
  }
}