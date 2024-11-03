import nextJest from "next/jest"; // Fixed import

const createJestConfig = nextJest({
  dir: "./",
});

import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",

  projects: [
    {
      displayName: "jsdom",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/**/*.test.[jt]s?(x)"],
      testPathIgnorePatterns: [
        "/node_modules/",
        "/.next/",
        "<rootDir>/src/core/",
        "<rootDir>/src/app/api/",
      ],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
      },
    },
    {
      displayName: "node",
      testEnvironment: "node",
      testMatch: [
        "<rootDir>/src/core/**/*.test.[jt]s?(x)",
        "<rootDir>/src/app/api/**/*.test.[jt]s?(x)",
        "<rootDir>/src/app/api/events/[id]/route.test.[jt]s?(x)",
      ],
      testPathIgnorePatterns: ["/node_modules/", "/.next/"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
      },
    },
  ],

  transformIgnorePatterns: ["/node_modules/(?!mssql)"],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};

export default createJestConfig(config);
