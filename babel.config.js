module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-typescript',
    '@babel/preset-flow',
  ],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        safe: true,
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
