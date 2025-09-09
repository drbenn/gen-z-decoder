module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
          'babel-preset-expo',
        {
          reanimated: false // Add this to prevent babel-preset-expo from adding the react-native-reanimated/plugin
        }
      ]
    ],
    plugins: ['react-native-worklets/plugin'],
  };
};