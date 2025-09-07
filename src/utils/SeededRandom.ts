import seedrandom from "seedrandom";

export class SeededRandom {
  private rng: seedrandom.StatefulPRNG<seedrandom.State.Arc4>;
  private _seed?: string;
  private _step: number = 0;

  constructor(state?: string) {
    // try to decode the seedOrState using atob and JSON.parse if it's a compact state string
    let step = 0;
    if (typeof state === "string") {
      try {
        // Try to decode as compact state string
        const decoded = SeededRandom.decodeCompactState(state);
        if (
          decoded &&
          typeof decoded.seed === "string" &&
          typeof decoded.step === "number"
        ) {
          this._seed = decoded.seed;
          step = decoded.step;
        }
      } catch {
        // Not a compact state string, proceed as normal seed string
        this._seed = state;
        step = 0; // Reset step if a new seed is provided
      }
    } else {
      this._seed = Math.random().toString(36).substring(2, 15); // Generate a random seed if not provided
      step = 0; // Reset step if state is provided
    }

    this.rng = seedrandom(this._seed, { state: true });

    if (step) {
      // Advance the RNG by step count
      for (let i = 0; i < step; i++) this.rng();
      this._step = step;
    }
  }

  random() {
    this._step++;
    return this.rng();
  }

  get seed() {
    return this._seed;
  }

  get step() {
    return this._step;
  }

  getCompactState(): { seed?: string; step: number } {
    return { seed: this._seed, step: this._step };
  }
  
  getCompactStateString(): string{
    return SeededRandom.encodeCompactState(this.getCompactState());
  }

  static encodeCompactState(state: { seed?: string; step: number }): string {
    return btoa(JSON.stringify(state));
  }

  static decodeCompactState(str: string): { seed?: string; step: number } {
    return JSON.parse(atob(str));
  }
}
