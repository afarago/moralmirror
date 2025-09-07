import React, { useEffect, useRef, useState } from "react";
import { Position } from "../types";
import {
  MAIN_TRACK_END_X,
  MAIN_TRACK_Y,
  SUB_TRACK_END_X,
} from "./trolley-const";

export interface TrolleyCarProps {
  trolleyPosition: Position;
  segment: "main" | "diverge";
  path: string;
  setIsAnimating?: (animating: boolean) => void;
  onSegmentEnd?: () => void;
}

const TROLLEY_WIDTH = 70;
const TROLLEY_HEIGHT = 40;
const TRACK_WIDTH = 10;
const MAIN_START_OFFSET = TROLLEY_WIDTH * 0.7;
const START_X = MAIN_START_OFFSET;
const START_Y = MAIN_TRACK_Y;
const MAIN_ADJUSTED_END_X = MAIN_TRACK_END_X;
const SUB_END_OFFSET = TROLLEY_WIDTH * 0.7;
const SUB_ADJUSTED_TRACK_END_X = SUB_TRACK_END_X - SUB_END_OFFSET;

const getTrolleyX = (position: Position, segment: string) => {
  if (position === undefined) return START_X;
  if (segment === "main") return MAIN_ADJUSTED_END_X;
  // if (segment === "diverge")
  return SUB_ADJUSTED_TRACK_END_X;
};

const ANIMATION_DURATION_PER_100 = 500;

const TrolleyCar: React.FC<TrolleyCarProps> = ({
  trolleyPosition,
  segment,
  path,
  setIsAnimating: setGlobalIsAnimating,
  onSegmentEnd,
}) => {
  const [x, setX] = useState(getTrolleyX(undefined, segment));
  const [y, setY] = useState(START_Y);
  const [isAnimating, setAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const refPath = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    setGlobalIsAnimating?.(isAnimating);
  }, [isAnimating, setGlobalIsAnimating]);

  useEffect(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const endX = getTrolleyX(trolleyPosition, segment);
    if (x >= endX) {
      // already at or past target
      // TC Resetting trolley to start
      setX(START_X);
      setY(START_Y);
      return;
    }

    const path = refPath.current;
    if (!path) return;
    const length = path.getTotalLength();
    const startOffset = segment === "main" ? MAIN_START_OFFSET : 0;
    const endOffset = segment === "main" ? 0 : SUB_END_OFFSET;
    const lengthAdjusted = length - startOffset - endOffset;
    const duration = (lengthAdjusted / 100) * ANIMATION_DURATION_PER_100;
    setAnimating(true);
    const startTime = performance.now();

    const animate = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const point = path.getPointAtLength(startOffset + lengthAdjusted * t);
      setX(point.x);
      setY(point.y);
      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setX(endX);
        setAnimating(false);
        onSegmentEnd?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [trolleyPosition, segment, path]);

  return (
    <>
      <g
        transform={`translate(${x - TROLLEY_WIDTH / 2},${
          y - TROLLEY_HEIGHT - TRACK_WIDTH
        })`}
      >
        <path ref={refPath} d={path} style={{ display: "none" }} />
        <rect
          width={TROLLEY_WIDTH}
          height={TROLLEY_HEIGHT}
          rx="15"
          fill="#E5E7EB"
          stroke="#6B7280"
          strokeWidth="5"
        />
        <circle cx={+15} cy={+40} r="8" fill="#6B7280" />
        <circle cx={+35} cy={+40} r="8" fill="#6B7280" />
        <circle cx={+55} cy={+40} r="8" fill="#6B7280" />
      </g>
    </>
  );
};

export default TrolleyCar;
