import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(react-markdown|remark-.*|rehype-.*)/)",
  ],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
};

export default config;
