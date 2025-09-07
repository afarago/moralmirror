import React, { useCallback } from "react";
import { Button, Card, Placeholder } from "react-bootstrap";
import { MdInfoOutline } from "react-icons/md";

import { Character } from "../character-generator";
import PlaceholderText from "./PlaceholderText";
import { Play } from "react-bootstrap-icons";
import { CharacterState } from "../types";
import clsx from "clsx";

interface CharacterCardProps {
  character: Character | undefined;
  className?: string;
  state?: CharacterState;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onShowBackstory?: (character: Character) => void;
  onSave?: () => void;
  onAIChoice?: () => void;
  isSaveDisabled?: boolean;
  isUserSelected?: boolean;
  isAISelected?: boolean;
  saveLabel?: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  state,
  style,
  children,
  onShowBackstory,
  onSave,
  onAIChoice,
  isSaveDisabled,
  isUserSelected,
  isAISelected,
  saveLabel,
}) => {
  const handleBackstoryButton = useCallback(() => {
    if (character && typeof onShowBackstory === "function") {
      onShowBackstory(character);
    }
  }, [character, onShowBackstory]);

  return (
    <Card
      className={clsx(
        "character-card",
        "text-white",
        "shadow-lg",
        state && `state-${state}`,
        isUserSelected || isAISelected ? "focused" : ""
      )}
      style={style}
      onClick={onSave}
    >
      {/* Save Button */}
      {character && onSave && (
        <div
          className={clsx(
            "position-absolute",
            "top-0",
            "text-nowrap",
            "save-button-container",
            isSaveDisabled && "d-none"
          )}
        >
          {!isUserSelected ? (
            <Button
              size="sm"
              onClick={onSave}
              variant={isUserSelected ? "secondary" : "outline-primary"}
              title="Save character"
            >
              {saveLabel || "Save"}
            </Button>
          ) : (
            <Button
              size="sm"
              hidden={!isUserSelected}
              variant="success"
              onClick={onAIChoice}
              title="Ask AI for choice"
              className="ms-1"
            >
              {saveLabel} <Play />
            </Button>
          )}
        </div>
      )}
      <Card.Body style={{ position: "relative" }}>
        {/* Info icon for additional context */}
        {character && (
          <div className="info-icon">
            <Button
              variant="clean"
              className="p-0"
              onClick={handleBackstoryButton}
              title="Show backstory"
            >
              <MdInfoOutline size="1.5em" />
            </Button>
          </div>
        )}

        {/* Decision State info */}
        {(isUserSelected || (state && isAISelected)) && (
          <div className="decision-info small text-start p-2">
            <div>
              {isUserSelected ? `> You would save ${character?.name}` : ""}
            </div>
            <div>
              {state && isAISelected ? `> AI saved ${character?.name}` : ""}
            </div>
          </div>
        )}

        {/* Character details */}
        <div>
          {!character ? (
            <>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={4} />
              </Placeholder>
              <PlaceholderText
                componentType={Card.Text}
                pattern={[7, 4, 4, 6, 8]}
              />
            </>
          ) : (
            <>
              <Card.Title>{character.name}</Card.Title>
              <Card.Text>{character.description}</Card.Text>
            </>
          )}
          {children}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CharacterCard;
