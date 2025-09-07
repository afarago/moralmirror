import axios from "axios";
import { useState } from "react";

import { Character } from "../character-generator";
import { PositionEnum } from "../types";

export function useBackstory(
  characters: Character[] | undefined,
  setCharacters: (c: Character[] | undefined) => void
) {
  const [showBackstory, setShowBackstory] = useState(false);
  const [backstoryLoading, setBackstoryLoading] = useState(false);
  const [backstoryCharacter, setBackstoryCharacter] = useState<
    Character | undefined
  >(undefined);

  const handleShowBackstory = async (character: Character) => {
    setBackstoryCharacter(character);
    setShowBackstory(true);

    if (!character?.backstory) {
      setBackstoryLoading(true);
      try {
        const { data } = await axios.post("/api/backstory", {
          name: character.name,
          description: character.description,
        });
        if (characters && character.name === characters[PositionEnum.A].name) {
          const chars2 = [...characters];
          chars2[PositionEnum.A] = {
            ...chars2[PositionEnum.A],
            backstory: data.backstory,
          };
          setCharacters(chars2);
        } else if (
          characters &&
          character.name === characters[PositionEnum.B].name
        ) {
          const chars2 = [...characters];
          chars2[PositionEnum.B] = {
            ...chars2[PositionEnum.B],
            backstory: data.backstory,
          };
          setCharacters(chars2);
        }
      } finally {
        setBackstoryLoading(false);
      }
    }
  };

  const handleHideBackstory = () => {
    setShowBackstory(false);
  };

  return {
    showBackstory,
    setShowBackstory,
    backstoryLoading,
    backstoryCharacter,
    setBackstoryCharacter,
    handleShowBackstory,
    handleHideBackstory,
  };
}
