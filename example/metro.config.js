const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const localPackagePath = path.resolve(__dirname, '..')

module.exports = (() => {
  const config = getDefaultConfig(__dirname)

  const { transformer, resolver } = config

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
  }
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      localPackagePath,
    ],
    sourceExts: [...resolver.sourceExts, 'svg'],
  }

  config.watchFolders = [...config.watchFolders, localPackagePath]

  return config
})()
