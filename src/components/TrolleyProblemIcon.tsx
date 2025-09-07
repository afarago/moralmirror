import React, { useEffect, useState } from "react";
import {
  BasePosition,
  getOtherPosition,
  Position,
  PositionEnum,
} from "../types";
import TrolleyCar from "./TrolleyCar";
import TrolleyLever from "./TrolleyLever";
import {
  BOTTOM_TRACK_PATH,
  MAIN_TRACK_PATH,
  TOP_TRACK_PATH,
} from "./trolley-const";
import { delay } from "../utils";

export interface TrolleyProblemIconProps {
  aiChoicePosition: Position;
  userChoicePosition: Position;
  setUserChoice: (pos: Position) => void;
  setIsAnimating: (animating: boolean) => void;
  canChangeChoice: boolean;
}

const TrolleyProblemIcon: React.FC<TrolleyProblemIconProps> = ({
  aiChoicePosition = undefined,
  userChoicePosition = undefined,
  setUserChoice,
  setIsAnimating: setGlobalIsAnimating,
  canChangeChoice = true,
}) => {
  const [animationSegment, setAnimationSegment] = useState<"main" | "diverge">(
    "main"
  );
  const [adjustedChoicePosition, setAdjustedChoicePosition] =
    useState<Position>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAIOverrideVisible, setIsAIOverrideVisible] = useState(false);

  useEffect(() => {
    if (!isAnimating && animationSegment === "main") return;
    setGlobalIsAnimating(isAnimating);
  }, [isAnimating, setGlobalIsAnimating]);

  useEffect(() => {
    if (userChoicePosition === undefined || aiChoicePosition === undefined) {
      setAdjustedChoicePosition(undefined);
      setAnimationSegment("main");
    }
  }, [userChoicePosition, aiChoicePosition]);

  const handleToggleUserChoice = () => {
    setUserChoice(getOtherPosition(userChoicePosition) ?? PositionEnum.A);
  };

  const handleTrolleySegmentEnd = async () => {
    if (animationSegment === "main") {
      const callDivergeSegment = () => {
        setIsAnimating(true);
        setAnimationSegment("diverge");
      };

      if (aiChoicePosition !== userChoicePosition) {
        await delay(200);
        setIsAIOverrideVisible(true);
        setAdjustedChoicePosition(aiChoicePosition);
        await delay(1000);
        callDivergeSegment();
      } else {
        setIsAIOverrideVisible(false);
        callDivergeSegment();
      }
    }
  };

  const choose = <T, S>(value: T, values: [T, T], results: [S, S, S]): S => {
    if (value === values[0]) return results[0];
    if (value === values[1]) return results[1];
    return results[2];
  };

  useEffect(() => {
    setAdjustedChoicePosition(userChoicePosition);
  }, [userChoicePosition]);

  const mainTrack = (
    <g onClick={() => setUserChoice(undefined)} className="train-track">
      <path d={MAIN_TRACK_PATH} />
      <path d={MAIN_TRACK_PATH} />
    </g>
  );

  const getDivergeTrack = (position: BasePosition, unfocused?: boolean) => (
    <g
      onClick={() => setUserChoice(position)}
      className={`train-track ${unfocused ? "unfocused" : ""}`}
    >
      <path d={position ? TOP_TRACK_PATH : BOTTOM_TRACK_PATH} />
      <path d={position ? TOP_TRACK_PATH : BOTTOM_TRACK_PATH} />
    </g>
  );

  const getTrolleyTracks = () => (
    <g>
      {/* Main horizontal track */}
      {mainTrack}
      {/* Diverging tracks */}
      {getDivergeTrack(getOtherPosition(adjustedChoicePosition), true)}
      {getDivergeTrack(adjustedChoicePosition ?? PositionEnum.B, false)}
    </g>
  );

  return (
    <svg
      width="800"
      height="360"
      viewBox="0 0 800 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: "100%" }}
      className="trolley-visualization"
    >
      {getTrolleyTracks()}

      {/* Trolley Car */}
      <TrolleyCar
        trolleyPosition={getOtherPosition(aiChoicePosition)}
        segment={animationSegment}
        path={
          animationSegment === "main"
            ? MAIN_TRACK_PATH
            : choose(
                adjustedChoicePosition,
                [PositionEnum.B, PositionEnum.A],
                [TOP_TRACK_PATH, BOTTOM_TRACK_PATH, ""]
              )
        }
        setIsAnimating={setIsAnimating}
        onSegmentEnd={handleTrolleySegmentEnd}
      />

      {/* Lever */}
      <g
        transform="translate(240, 140) scale(0.5)"
        style={{ cursor: canChangeChoice ? "pointer" : "default" }}
        onClick={handleToggleUserChoice}
      >
        <TrolleyLever position={adjustedChoicePosition} />
      </g>

      {/* Lever label */}
      <text
        className={isAIOverrideVisible ? "" : "d-none"}
        x={240 + 60} // lever center + offset
        y={140 + 120} // lever base + offset below
        fontSize="24"
        textAnchor="middle"
        fill="white"
        style={{ textAlign: "center", userSelect: "none" }}
      >
        AI overrides
      </text>
    </svg>
  );
};

export default TrolleyProblemIcon;
