// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  // resolver: undefined,
  setupFiles: ['./jest.setup.js'],

  // setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
