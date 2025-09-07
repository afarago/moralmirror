import {
  EnvelopeFill,
  GlobeEuropeAfricaFill,
  Linkedin,
} from "react-bootstrap-icons";

import React from "react";

const Footer: React.FC = () => (
  <footer
    className="border-top footer text-secondary py-2  mt-4 "
    aria-hidden="true"
    role="presentation"
  >
    <div className="container text-center d-flex flex-column">
      <div className="small align-self-center">
        This tool is designed for educational purposes to explore ethical
        decision-making scenarios.
      </div>
      <div className="d-flex gap-2 flex-row align-self-center">
        <a
          href="https://www.linkedin.com/in/afarago/"
          target="_blank"
          aria-label="LinkedIn profile for Attila Farago"
          tabIndex={-1}
        >
          <Linkedin />
        </a>
        <a
          href="mailto:attila.farago.hu+moralmirror@gmail.com"
          aria-label="Send email to Attila Farago"
          tabIndex={-1}
        >
          <EnvelopeFill />
        </a>
        <a
          href="https://www.attilafarago.hu"
          target="_blank"
          aria-label="Attila Farago personal"
          tabIndex={-1}
        >
          <GlobeEuropeAfricaFill />
        </a>
        {""}
        Attila Farago,
        <span title={import.meta?.env?.VITE_COMMIT_REF ?? "development"}>
          2025
        </span>
        <a
          href="https://app.netlify.com/projects/moralmirror/deploys"
          target="_blank"
          aria-label="Netlify deploy status"
          tabIndex={-1}
        >
          <img src="https://api.netlify.com/api/v1/badges/27a17808-e1b3-4332-b26e-8616fff9038c/deploy-status"></img>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
