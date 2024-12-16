module.exports = {
    testEnvironment: 'node',
    rootDir: './microservices/back-end-layer',
    moduleFileExtensions: ['js', 'json'],
    testMatch: ['<rootDir>/tests/**/*.test.js'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    },
};