import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import Markdown from "react-markdown";

interface BackstoryModalProps {
  show: boolean;
  onHide: () => void;
  characterName: string;
  backstory?: string;
  isLoading?: boolean;
}

const BackstoryModal: React.FC<BackstoryModalProps> = ({
  show,
  onHide,
  characterName,
  backstory,
  isLoading = false,
}) => (
  <Modal
    show={show}
    onHide={onHide}
    centered
    size="xl"
    className="backstory-modal"
  >
    <Modal.Header closeButton>
      <Modal.Title className="h3">Backstory for {characterName}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {isLoading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <div>Loading backstory...</div>
        </div>
      ) : backstory ? (
        <Markdown>{backstory}</Markdown>
      ) : (
        <div className="text-secondary">No backstory available.</div>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default BackstoryModal;
