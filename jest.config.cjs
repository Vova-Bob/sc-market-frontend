module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    // Mock styles and assets
    "\\.(css|less|scss|sass)$": "<rootDir>/test/__mocks__/styleMock.js",
    "\\.(png|jpg|jpeg|gif|webp|avif)$": "<rootDir>/test/__mocks__/fileMock.js",
    // Mock SVGR React imports (e.g. import Icon from 'file.svg?react')
    "^.+\\.svg\\?react$": "<rootDir>/test/__mocks__/svgrMock.tsx",
  },
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", tsx: true, dynamicImport: true },
          transform: { react: { runtime: "automatic" } },
        },
        module: { type: "commonjs" },
      },
    ],
  },
  testMatch: [
    "<rootDir>/src/components/**/__tests__/**/*.(test|spec).tsx",
    "<rootDir>/src/components/**/*.(test|spec).tsx",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/components/**/*.{ts,tsx}",
    "!src/components/**/__tests__/**",
  ],
}
