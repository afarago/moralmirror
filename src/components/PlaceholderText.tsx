import React from "react";
import { Placeholder } from "react-bootstrap";

interface PlaceholderTextProps {
  componentType?: React.ElementType;
  pattern: number[];
  animation?: "glow" | "wave";
}

const PlaceholderText: React.FC<PlaceholderTextProps> = ({
  componentType,
  pattern,
  animation = "glow",
}) => {
  return (
    <Placeholder as={componentType} animation={animation}>
      {pattern.map((xs, index) => (
        <React.Fragment key={index}>
          <Placeholder xs={xs} />
          {index < pattern.length - 1 && " "}
        </React.Fragment>
      ))}
    </Placeholder>
  );
};

export default PlaceholderText;
