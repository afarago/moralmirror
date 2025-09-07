import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import TrolleyProblemIcon from "../assets/tp-bg.webp";

type AboutModalProps = {
  show: boolean;
  onHide: () => void;
};

const AboutModal: React.FC<AboutModalProps> = ({ show, onHide }) => {
  // Preload the trolley problem image when the component mounts
  useEffect(() => {
    const img = new window.Image();
    img.src = TrolleyProblemIcon;
  }, []);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      className="about-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="h3">
          About Moral Mirror
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Moral Mirror</strong> is an interactive experiment exploring
          moral decision-making. Enter your credo, and see how an AI predicts
          your choices in classic trolley dilemmas.
        </p>
        <p className="quote">
          A trolley is stopped at a fork in the tracks, with one person tied to
          each path. You must choose which track the trolley will go down,
          knowing that your choice will result in the death of one person. The
          dilemma is about making an active decision between two tragic
          outcomes.
        </p>
        <p>
          This simplified trolley problem was created to help you reflect on the
          gap between your stated values and your actions.
        </p>
        <img
          src={TrolleyProblemIcon}
          alt="Trolley Problem"
          className="about-pic text-center mx-lg-3 float-lg-start w-50"
          style={{ height: "200px", width: "300px" }}
        />
        <p>
          The concept of the original trolley problem is a philosophical thought
          experiment that raises questions about ethics and morality. My first
          exposure to it was through the movie{" "}
          <a
            href="https://www.imdb.com/title/tt4955642/"
            rel="noopener noreferrer"
            target="_blank"
          >
            The Good Place
          </a>
          , which presented a humorous yet thought-provoking take on moral
          philosophy.
        </p>
        <p className="quote">
          <i>"That's why everyone hates moral philosophy professors"</i>
          <br/>- Chidi Anagonye
        </p>

        <p>
          Later, a long talk with my brother about the trolley problem inspired
          me to create this app as a way to engage with these ideas in a more
          interactive and personal manner.
        </p>
        <p>
          Much more content is available on{" "}
          <a
            href="https://troypancake.substack.com/p/reflections-on-the-trolley-problem"
            target="_blank"
            rel="noopener noreferrer"
          >
            this topic
          </a>{" "}
          at Substack.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AboutModal;
