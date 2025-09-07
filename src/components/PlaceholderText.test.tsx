import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Card } from "react-bootstrap";
import PlaceholderText from "./PlaceholderText";

describe("PlaceholderText", () => {
  it("renders placeholders according to pattern", () => {
    const { container } = render(<PlaceholderText pattern={[2, 3, 4]} />);
    // Should render 3 placeholders
    expect(container.querySelectorAll(".placeholder").length).toBe(3);
  });

  it("renders with custom componentType", () => {
    const { container } = render(<PlaceholderText pattern={[5]} componentType={Card.Text} />);
    // Card.Text renders as <p>
    expect(container.querySelector("p")).toBeInTheDocument();
  });

  it("renders with wave animation", () => {
    const { container } = render(<PlaceholderText pattern={[2]} animation="wave" />);
    expect(container.querySelector(".placeholder-wave")).toBeInTheDocument();
  });
});
