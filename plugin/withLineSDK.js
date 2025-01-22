const { withPlugins } = require('@expo/config-plugins')

const withAppDelegateMod = require('./ios/withAppDelegateMod')
const withCustomPlist = require('./ios/withCustomPlist')
const withLineChannelId = require('./android/withLineChannelId')

function withLineSDK(config, props) {
  if (!props?.channelId) {
    throw Error('Please specify channelId')
  }

  return withPlugins(config, [
    // Android
    [withLineChannelId, props],

    // iOS
    [withCustomPlist, props],
    [withAppDelegateMod, props],
  ])
}

module.exports = withLineSDK
