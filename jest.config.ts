/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type { Config } from "jest";

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testPathIgnorePatterns: ["./node_modules/"],
  globals: {
    'ts-jest': {
      diagnostics: false, 
      useESM: true
    }
  },
  roots: [
    "<rootDir>",
    "./src"
  ],
  modulePaths: [
    "<rootDir>",
    "./src"
  ],
  moduleDirectories: [
    "node_modules"
  ],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;