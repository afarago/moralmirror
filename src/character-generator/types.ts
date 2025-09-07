// Type definitions
export interface TraitOption {
  value: string;
  isActive?: boolean;
  weight?: number; // Optional weight for weighted selection
  skipArticle?: boolean; // Whether to skip the article for this category
}

export interface TraitCategory {
  name: string;
  weight: number;
  options: TraitOption[];
  skipArticle?: boolean; // Whether to skip the article for this category
}

export interface Character {
  name: string;
  traits: Record<string, TraitOption>;
  description: string;
  backstory?: string; // Optional backstory for the character
}
