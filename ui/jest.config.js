/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@shared/(.*)$": "<rootDir>/src/modules/shared/$1",
    "^@auth/(.*)$": "<rootDir>/src/modules/auth/$1",
    "^@tasks/(.*)$": "<rootDir>/src/modules/tasks/$1",
    "^@projects/(.*)$": "<rootDir>/src/modules/projects/$1",
    "^@labels/(.*)$": "<rootDir>/src/modules/labels/$1",
    "^@views/(.*)$": "<rootDir>/src/modules/views/$1",
    "^@admin/(.*)$": "<rootDir>/src/modules/admin/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx}",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: "<rootDir>/tsconfig.jest.json" },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
