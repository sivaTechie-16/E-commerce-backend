module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/*.test.ts'],
    setupFiles: ['reflect-metadata'], // Ensures the metadata API is loaded before tests
  };
  