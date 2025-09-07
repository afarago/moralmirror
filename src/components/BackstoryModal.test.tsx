import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import BackstoryModal from "./BackstoryModal";

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("BackstoryModal", () => {
  it("renders modal with character name", () => {
    render(
      <BackstoryModal show={true} onHide={() => {}} characterName="Alice" />
    );
    expect(screen.getByText(/Backstory for Alice/)).toBeInTheDocument();
  });

  it("shows loading spinner when isLoading", () => {
    render(
      <BackstoryModal
        show={true}
        onHide={() => {}}
        characterName="Bob"
        isLoading
      />
    );
    expect(screen.getByText(/Loading backstory/)).toBeInTheDocument();
  });

  it("shows backstory when provided", () => {
    render(
      <BackstoryModal
        show={true}
        onHide={() => {}}
        characterName="Eve"
        backstory="This is Eve's backstory."
      />
    );
    expect(screen.getByText(/This is Eve's backstory/)).toBeInTheDocument();
  });

  it("shows fallback when no backstory", () => {
    render(
      <BackstoryModal show={true} onHide={() => {}} characterName="Zed" />
    );
    expect(screen.getByText(/No backstory available/)).toBeInTheDocument();
  });
});
