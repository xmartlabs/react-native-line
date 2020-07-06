module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        root: ['.'],
      },
    ],
    'optional-require',
  ],
  presets: ['module:metro-react-native-babel-preset'],
}
