const { withPlugins } = require('@expo/config-plugins')

// Android
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
    [withLineChannelId, props],
  ])
}

module.exports = withLineSDK
