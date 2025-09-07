import axios from "axios";
import { useState } from "react";

import { Character } from "../character-generator";
import {
  AIChoiceResult,
  BasePositions,
  Position,
  PositionEnum,
} from "../types";

export function useAIChoice(mockSurvivorChoice?: Position) {
  const [isThinking, setIsAIThinking] = useState(false);
  const [choiceResult, setChoiceResult] = useState<AIChoiceResult | undefined>(
    undefined
  );

  const resetChoiceResult = () => {
    setChoiceResult(undefined);
  };

  const askForChoice = async (
    credo: string | undefined,
    characters: Character[] | undefined
  ) => {
    if (mockSurvivorChoice !== undefined) {
      setChoiceResult({
        survivor: characters?.[mockSurvivorChoice]?.name ?? "Mock Survivor",
        survivor_position: mockSurvivorChoice,
        reasons: ["reason A", "reason B"],
        revised_credo: "",
        model: "",
      });
      return;
    }

    // non mock result
    if (characters?.length !== BasePositions.length) return;

    setIsAIThinking(true);

    try {
      const response = await axios.post(
        "/api/moral-trolley-choice",
        {
          credo,
          tracks: [
            {
              track: PositionEnum.A,
              name: characters[PositionEnum.A].name,
              description: characters[PositionEnum.A].description,
            },
            {
              track: PositionEnum.B,
              name: characters[PositionEnum.B].name,
              description: characters[PositionEnum.B].description,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = response.data as AIChoiceResult;

      try {
        if (!data || !characters) throw new Error("No AI choice or characters");
        const characterSurvivorPos = characters.findIndex(
          (c) => c.name === data.survivor
        ) as PositionEnum;
        data.survivor_position = characterSurvivorPos;
      } catch (e) {
        console.error("Error determining AI choice position:", e);
        data.survivor_position = undefined;
      }

      setChoiceResult(data);
    } catch (error) {
      console.error("Error asking AI for choice:", error);
    } finally {
      setIsAIThinking(false);
    }
  };

  return {
    isThinking,
    choiceResult,
    resetChoiceResult,
    askForChoice,
  };
}
