import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import { PositionEnum } from "../types";
import TrolleyCar from "./TrolleyCar";

describe("TrolleyCar", () => {
  const MAIN_TRACK_PATH = "M0 180 H300"; // simple straight path

  beforeAll(() => {
    if (typeof SVGElement === "undefined") {
      // @ts-expect-error mock SVGPathElement
      global.SVGElement = function () {};
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (SVGElement.prototype as any).getTotalLength = jest.fn(() => 100);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (SVGElement.prototype as any).getPointAtLength = jest.fn(
      (len: number) =>
        ({
          x: len,
          y: 180,
        } as DOMPoint)
    );
  });

  it("renders SVG elements for trolley", () => {
    const { container } = render(
      // TrolleyCar is meant to be rendered inside an <svg>
      <svg>
        <TrolleyCar
          trolleyPosition={undefined}
          path={MAIN_TRACK_PATH}
          segment="main"
        />
      </svg>
    );
    // Should render a <g> group and a <rect> for the trolley body
    expect(container.querySelector("g")).toBeInTheDocument();
    expect(container.querySelector("rect")).toBeInTheDocument();
    // Should render 3 wheels as <circle>
    expect(container.querySelectorAll("circle").length).toBe(3);
  });

  it("calls setIsAnimating when animating", () => {
    jest.useFakeTimers();
    const setIsAnimating = jest.fn();
    const { rerender } = render(
      <svg>
        <TrolleyCar
          trolleyPosition={undefined}
          path={MAIN_TRACK_PATH}
          setIsAnimating={setIsAnimating}
          segment="main"
        />
      </svg>
    );
    // Move trolley to position "A"
    act(() => {
      rerender(
        <svg>
          <TrolleyCar
            trolleyPosition={PositionEnum.A}
            path={MAIN_TRACK_PATH}
            setIsAnimating={setIsAnimating}
            segment="main"
          />
        </svg>
      );
      jest.runAllTimers();
    });
    // Fast-forward timers to simulate animation
    expect(setIsAnimating).toHaveBeenCalledWith(true);
    expect(setIsAnimating).toHaveBeenCalledWith(false);
    jest.useRealTimers();
  });

  it("renders at correct initial position for undefined", () => {
    const { container } = render(
      <svg>
        <TrolleyCar
          trolleyPosition={undefined}
          path={MAIN_TRACK_PATH}
          segment="main"
        />
      </svg>
    );
    const group = container.querySelector("g");
    expect(group).toBeInTheDocument();
    // The transform attribute should exist
    expect(group?.getAttribute("transform")).toMatch(/translate/);
  });
});
