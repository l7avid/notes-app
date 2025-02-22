module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      safe: true,
      moduleName: '@env',
      path: '.env',
    }]
  ]
};
