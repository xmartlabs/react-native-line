const { withPlugins } = require('@expo/config-plugins')

// Android
const withApplyLineImplementation = require('./android/withApplyLineImplementation')
const withApplyMaven = require('./android/withApplyMaven')
const withLineManifest = require('./android/withLineManifest')
const withApplyAndroidCompileOptions = require('./android/withApplyAndroidCompileOptions')
const withLineChannelId = require('./android/withLineChannelId')

// iOS
const withCustomPlist = require('./ios/withCustomPlist')
const withLinePod = require('./ios/withLinePod')
const withAppDelegateMod = require('./ios/withAppDelegateMod')

function withLineSDK(config, props) {
  if (!props?.channelId) {
    throw Error('Please specify channelId')
  }
  return withPlugins(config, [
    // iOS
    withLinePod,
    [withCustomPlist, props],
    [withAppDelegateMod, props],

    // Android
    withApplyLineImplementation,
    withApplyMaven,
    withLineManifest,
    withApplyAndroidCompileOptions,
    [withLineChannelId, props],
  ])
}

module.exports = withLineSDK
