import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";

import ReactGA from "react-ga4";
import "./App.scss";

import { Character, CharacterGenerator } from "../character-generator";
import { useAIChoice } from "../hooks/useAIChoice";
import { useBackstory } from "../hooks/useBackstory";
import {
  BasePositions,
  CharacterState,
  CharacterStateEnum,
  Position,
  PositionEnum,
} from "../types";
import { SeededRandom } from "../utils/SeededRandom";
import AboutModal from "./AboutModal";
import BackstoryModal from "./BackstoryModal";
import CharacterCard from "./CharacterCard";
import Footer from "./Footer";
import PlaceholderText from "./PlaceholderText";
import TrolleyProblemIcon from "./TrolleyProblemIcon";
import Logo from "../assets/favicon.webp";

const DEFAULT_CREDO =
  "Harm no other, be altruistic and prefer long term societal values";
const LOCAL_STORAGE_CREDO_KEY = "moral-mirror-credo";

const isDevEnvironment = process.env.NODE_ENV === "development";
if (!isDevEnvironment) {
  const GA_TRACKING_ID = "G-EMB57T6HTQ";
  ReactGA.initialize(GA_TRACKING_ID);
}

const App: React.FC = () => {
  // Modal state
  const [showAbout, setShowAbout] = useState(false);

  // Character and app state
  const [characters, setCharacters] = useState<Character[] | undefined>(
    undefined
  );
  const [credo, setCredo] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_CREDO_KEY) ?? DEFAULT_CREDO;
  });
  const [isCharacterGenerating, setIsCharacterGenerating] = useState(false);
  const [aiChoice, setAiChoice] = useState<Position>(undefined);
  const [isTrolleyAnimating, setIsTrolleyAnimating] = useState(false);
  const [userChoice, setUserChoice] = useState<Position>(undefined);

  const [seededRandom, setSeededRandom] = useState(new SeededRandom());
  const [seedStateAtGeneration, setSeedStateAtGeneration] = useState<
    string | undefined
  >(undefined);

  // AI choice logic
  const mockAIChoice = PositionEnum.A; // for testing
  const {
    isThinking: isAIThinking,
    choiceResult: aiChoiceResult,
    resetChoiceResult: resetAIChoiceResult,
    askForChoice: askAIForChoice,
  } = useAIChoice(isDevEnvironment ? mockAIChoice : undefined);

  // Backstory modal logic
  const {
    showBackstory,
    backstoryLoading,
    backstoryCharacter,
    handleShowBackstory,
    handleHideBackstory,
  } = useBackstory(characters, setCharacters);

  // Generate new characters
  const handleGenerateCharacters = async () => {
    setUserChoice(undefined);
    let nextSeededRandom = seededRandom;

    // If step count is above threshold and not using a fixed seed, reset the generator
    // if would be too expensive to continue with the current state
    // This is a simple heuristic to avoid performance issues with large step counts
    nextSeededRandom = new SeededRandom();
    setSeededRandom(nextSeededRandom);

    await generateCharacterPair(false, nextSeededRandom);

    // remove any query parameter (seed) through history
    window.history.replaceState(null, "", window.location.pathname);
  };

  const handleAIChoice = () => {
    askAIForChoice(credo, characters);
  };

  const handleSetUserChoice = useCallback(
    (pos: Position) => {
      if (isTrolleyAnimating) return; // cannot change choice while animating
      if (aiChoiceResult) return; // cannot change choice after AI has made a choice
      setUserChoice(pos);
    },
    [isTrolleyAnimating, aiChoiceResult]
  );

  const generateCharacterPair = useCallback(
    async (useSeed: boolean, _seededRandom: SeededRandom) => {
      if (useSeed) {
        const seedParam = getSeedParam();
        if (seedParam) {
          _seededRandom = new SeededRandom(seedParam);
          setSeededRandom(_seededRandom);
        }
      }

      setCharacters(undefined);
      setAiChoice(undefined);
      setIsCharacterGenerating(true);
      resetAIChoiceResult();
      setUserChoice(undefined);

      // actually generate characters
      const newSeed = _seededRandom.getCompactStateString();
      setSeedStateAtGeneration(newSeed);
      const charsNew = new CharacterGenerator(
        _seededRandom
      ).generateCharacterPair();
      setCharacters(charsNew);
      setIsCharacterGenerating(false);

      // save the newSeed to url with history API
      // const newUrl = `${window.location.pathname}?seed=${newSeed}`;
      // window.history.pushState(null, "", newUrl);
    },
    [resetAIChoiceResult]
  );

  // Effects
  useEffect(() => {
    if (aiChoiceResult) {
      setIsTrolleyAnimating(true);
    }
    // Do not set isTrolleyAnimating on characterA or characterB change
    // Only on choiceResult change
  }, [aiChoiceResult]);

  useEffect(() => {
    setAiChoice(aiChoiceResult?.survivor_position);
  }, [aiChoiceResult, characters]);

  useEffect(() => {
    resetAIChoiceResult();
    setAiChoice(undefined);
    setIsTrolleyAnimating(false);

    generateCharacterPair(true, seededRandom);
    if (credo !== undefined) {
      localStorage.setItem(LOCAL_STORAGE_CREDO_KEY, credo);
    }
  }, [credo]);

  const getCharacterState = (
    pos: Position,
    char: PositionEnum
  ): CharacterState =>
    pos === undefined || isTrolleyAnimating
      ? undefined
      : pos === char
      ? CharacterStateEnum.Survivor
      : CharacterStateEnum.Dead;

  const characterStates: CharacterState[] = BasePositions.map((p) =>
    getCharacterState(aiChoice, p)
  );
  const getBackstoryText = () => {
    if (!backstoryCharacter?.name || !characters) return undefined;
    const character = characters.find(
      (c) => c.name === backstoryCharacter.name
    );
    return character?.backstory;
  };

  const showReasonOrThinking = aiChoiceResult !== undefined || isAIThinking;
  const reasonsText = aiChoiceResult?.reasons;

  const getSeedParam = () => {
    const params = new URLSearchParams(window.location.search);
    const seedParam = params.get("seed");
    return seedParam;
  };

  return (
    <Container
      fluid
      className="app container-lg vh-100 bg-dark text-white d-flex flex-column align-items-center justify-content-start"
    >
      {/* Header and Credo */}
      <Row className="w-100 align-items-center pt-4 pb-2">
        <Col>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowAbout(true)}
            className="position-absolute top-0 end-0 m-4"
          >
            <img src={Logo} alt="Trolley Icon" width={30} height={30} className="me-2" />
            About
          </Button>
          <h1 className="display-4 fw-bold text-center text-white">
            Moral Mirror
          </h1>
        </Col>
        <Col xs="auto"></Col>
      </Row>
      <Row className="w-100">
        <div className="text-center text-white">
          Explore the line between what you believe and what you would do. The
          lives you save (and don't) will show you who you are.
        </div>
        <div
          className="text-center text-secondary small"
          hidden={aiChoiceResult !== undefined || isAIThinking}
        >
          A trolley is stopped at a fork in the tracks, with one person tied to
          each path. You must choose which track the trolley will go down,
          knowing that your choice will result in the death of one person. The
          dilemma is about making an active decision between two tragic
          outcomes. You will state your credo, which will guide the AI's
          guessing on your potential decision-making.
        </div>
      </Row>

      {/* Horizontal Layout */}
      <Container className="w-100 flex-grow-1 justify-content-center align-items-center d-flex flex-column gap-3">
        <Row className="w-100 align-items-center justify-content-center">
          {/* Left: Trolley SVG */}
          <Col className="d-none d-md-flex flex-column align-items-center justify-content-center">
            <TrolleyProblemIcon
              aiChoicePosition={aiChoice}
              userChoicePosition={userChoice}
              canChangeChoice={!showReasonOrThinking}
              setUserChoice={handleSetUserChoice}
              setIsAnimating={setIsTrolleyAnimating}
            />
          </Col>

          {/* Right: Cards stacked vertically, visually aligned with tracks */}
          <Col className="d-flex gap-3 flex-column cards-column">
            {showReasonOrThinking && (
              <div className="text-secondary small">
                {!isTrolleyAnimating && reasonsText?.[PositionEnum.A]}
                {(isAIThinking || isTrolleyAnimating) && (
                  <PlaceholderText pattern={[7, 4, 4, 6, 8]} />
                )}
              </div>
            )}
            {characters &&
              BasePositions.map((char) => {
                const character = characters[char];
                const state = characterStates[char];
                return (
                  <CharacterCard
                    key={char}
                    character={character}
                    state={state}
                    onShowBackstory={handleShowBackstory}
                    onSave={() => handleSetUserChoice(char)}
                    onAIChoice={handleAIChoice}
                    isSaveDisabled={showReasonOrThinking}
                    isUserSelected={userChoice === char}
                    isAISelected={aiChoiceResult?.survivor === character?.name}
                    saveLabel={`Save ${character?.name || char}`}
                  />
                );
              })}
            {showReasonOrThinking && (
              <div className="text-secondary small">
                {!isTrolleyAnimating && reasonsText?.[PositionEnum.B]}
                {(isAIThinking || isTrolleyAnimating) && (
                  <PlaceholderText pattern={[7, 4, 4, 6, 8]} />
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <Row className="w-100 mb-3 w-75">
        <Col>
          {/* Modified Credo by AI */}
          <Row
            hidden={
              isAIThinking ||
              isTrolleyAnimating ||
              aiChoiceResult === undefined ||
              userChoice === aiChoiceResult?.survivor_position
            }
            className="mt-1"
          >
            {aiChoiceResult?.revised_credo && (
              <Alert key="credo2" variant="info">
                <h4>Revised Credo</h4>
                <div className="small mt-1">
                  As your moral choice dictated a different choice than the AI
                  predicted, let me suggest a slightly revised credo to
                  consider.
                </div>
                <div className="fw-bold">{aiChoiceResult?.revised_credo}</div>
              </Alert>
            )}
          </Row>

          {/* Credo Input */}
          <Form>
            <Form.Group as={Row} className="mb-2 align-items-center">
              <Form.Label column md="auto" size="auto">
                Your Moral Credo
              </Form.Label>
              <Col>
                <Form.Control
                  value={credo || ""}
                  placeholder="Enter your credo here..."
                  onChange={(e) => setCredo(e.target.value)}
                />
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>

      {/* Button Row */}
      <Row className="button-row">
        <Col className="text-center d-flex justify-content-center align-items-center gap-3">
          <Button
            onClick={handleAIChoice}
            disabled={
              isAIThinking || !!aiChoiceResult || userChoice === undefined
            }
            variant={aiChoiceResult ? "outline-secondary" : "primary"}
          >
            {isAIThinking && <Spinner as="span" size="sm" className="me-2" />}
            What AI thinks you would do
          </Button>

          <Button
            onClick={handleGenerateCharacters}
            disabled={isCharacterGenerating}
            variant="outline-primary"
          >
            {isCharacterGenerating && (
              <Spinner as="span" size="sm" className="me-2" />
            )}
            Generate New Characters
          </Button>
          <Button
            variant="outline-primary"
            hidden={isTrolleyAnimating || !aiChoiceResult}
            onClick={() => {
              window.open(
                `${window.location.pathname}?seed=${seedStateAtGeneration}`,
                `_blank`,
                "noopener,noreferrer"
              );
            }}
          >
            Share This Scenario
          </Button>
        </Col>
      </Row>

      {/* Backstory Modal */}
      <BackstoryModal
        show={showBackstory}
        onHide={handleHideBackstory}
        characterName={backstoryCharacter?.name || ""}
        backstory={getBackstoryText()}
        isLoading={backstoryLoading}
      />

      {/* About Modal */}
      <AboutModal show={showAbout} onHide={() => setShowAbout(false)} />

      {/* Footer */}
      <Footer />
    </Container>
  );
};

export default App;
