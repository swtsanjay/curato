module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            { tsconfig: { module: 'CommonJS', moduleResolution: 'Node' } },
        ],
    },
};
