import React from "react";
import { Position, PositionEnum } from "../types";

export interface TrolleyLevelProps {
  position: Position;
}

const getLeverAngle = (position: Position) => {
  if (position === undefined) return 0;
  return (position === PositionEnum.A ? +1 : -1) * 50;
};

const TrolleyLever: React.FC<TrolleyLevelProps> = ({ position }) => {
  const angle = getLeverAngle(position);

  return (
    <>
      <g stroke="#777" strokeWidth="6">
        <g fill="white">
          <g mask="url(#pivotMask)" fill="#ccc">
            <path
              d="
                M 60 150
                L 160 150
                Q 168 150 165 140
                L 155 110
                Q 150 100 130 104
                L 90 104
                Q 70 100 65 110
                L 55 140
                Q 52 150 60 150
                Z
                "
            />
            <path d="M30 165 L190 165 L180 140 L40 140 Z" />
          </g>

          <g
            id="lever"
            fill="white"
            transform={`rotate(${angle} 110 100)`}
            style={{ transition: "transform 0.5s ease-in-out" }}
          >
            <rect
              x="103"
              y="0"
              width="14"
              height="85"
              mask="url(#pivotMask)"
            />
            <path transform="translate(0,-10)"
              d="M95 10
                 A15 15 0 0 1 125 10
                 L125 35
                 L95 35
                 Z"
            />
          </g>
          <circle
            cx="110"
            cy="100"
            r="25"
            fill="white"
            mask="url(#pivotMask)"
          />
          <circle cx="110" cy="100" r="10" fill="none" />

          <mask id="pivotMask">
            <rect x="0" y="0" width="220" height="220" />
            <circle cx="110" cy="100" r="10" fill="black" />
          </mask>
        </g>
      </g>
    </>
  );
};

export default TrolleyLever;
