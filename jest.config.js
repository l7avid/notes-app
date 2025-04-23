module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^react-native-vector-icons/MaterialCommunityIcons$':
      '<rootDir>/__mocks__/react-native-vector-icons/MaterialCommunityIcons.js',
  },
};
