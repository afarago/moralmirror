// src/components/App.tsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { CharacterGenerator, Character } from "../character-generator";
import "../App.css";

const App: React.FC = () => {
  const [characterA, setCharacterA] = useState<Character | null>(null);
  const [characterB, setCharacterB] = useState<Character | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewCharacters = async () => {
    setIsGenerating(true);

    // Add small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { characterA: newCharacterA, characterB: newCharacterB } =
      CharacterGenerator.generateCharacterPair();

    setCharacterA(newCharacterA);
    setCharacterB(newCharacterB);
    setIsGenerating(false);
  };

  useEffect(() => {
    generateNewCharacters();
  }, []);

  return (
    <div className="app-background min-vh-100">
      <Container fluid className="py-5">
        {/* Header */}
        <Row className="mb-2">
          <Col>
            <div className="text-center">
              <h1 className="display-4 fw-bold mb-4 gradient-text">
                Attila's Moral Mirror
              </h1>
              <p
                className="lead text-light mx-auto"
                style={{ maxWidth: "600px" }}
              >
                Explore the line between what you believe and what you would do.
                The lives you save (and don't) will show you who you are.
              </p>
            </div>
          </Col>
        </Row>

        {/* Character Cards */}
        <Row className="mb-4">
          {/* Track A */}
          <Col lg={6}>
            <Card className="h-100 character-card track-a-card">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="track-indicator track-a-indicator me-3"></div>
                  <h2 className="h3 mb-0 track-a-title">Track A</h2>
                </div>

                {characterA && !isGenerating && (
                  <>
                    <Card.Text className="fs-5 mb-4 character-description">
                      {characterA.description}
                    </Card.Text>
                  </>
                )}

                {isGenerating && (
                  <div className="d-flex align-items-center justify-content-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Track B */}
          <Col lg={6}>
            <Card className="h-100 character-card track-b-card">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="track-indicator track-b-indicator me-3"></div>
                  <h2 className="h3 mb-0 track-b-title">Track B</h2>
                </div>

                {characterB && !isGenerating && (
                  <>
                    <Card.Text className="fs-5 mb-4 character-description">
                      {characterB.description}
                    </Card.Text>
                  </>
                )}

                {isGenerating && (
                  <div className="d-flex align-items-center justify-content-center py-5">
                    <Spinner animation="border" variant="info" />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Generate Button */}
        {/* <Row >
          <Col className="text-center">
            <Button
              onClick={generateNewCharacters}
              disabled={isGenerating}
              size="lg"
              className="generate-btn px-5 py-3"
            >
              {isGenerating ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                  Generating...
                </>
              ) : (
                "Generate New Characters"
              )}
            </Button>
          </Col>
        </Row> */}

        {/* Footer */}
        <Row className="mt-5">
          <Col className="text-center">
            <p className="text-secondary small">
              This tool is designed for educational purposes to explore ethical
              decision-making scenarios.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
