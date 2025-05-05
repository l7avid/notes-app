module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-vector-icons|@react-native|@react-native-community)/)',
  ],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^react-native-vector-icons/MaterialCommunityIcons$':
      '<rootDir>/__mocks__/react-native-vector-icons/MaterialCommunityIcons.js',
  },
};
