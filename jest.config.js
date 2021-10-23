const { defaults } = require('jest-config');

module.exports = {
    verbose: true,
    transform: {
        '\\.tsx?$': 'ts-jest',
        '\\.csv$': 'jest-raw-loader',
    },
    testEnvironment: 'jsdom',
    testRegex: '/(src|tests)/.*\\.test\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', ...defaults.moduleFileExtensions],
    coverageReporters: ['text', 'html'],
    coverageDirectory: 'html/coverage/',
    moduleNameMapper: { '^@/(.*)': '<rootDir>/src/$1' },
};
