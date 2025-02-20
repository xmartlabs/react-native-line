const { withPlugins } = require('@expo/config-plugins')

const withCustomAppDelegate = require('./ios/withCustomAppDelegate')
const withCustomInfoPlist = require('./ios/withCustomInfoPlist')

function withLineSDK(config, props) {
  return withPlugins(config, [
    [withCustomAppDelegate, props],
    [withCustomInfoPlist, props],
  ])
}

module.exports = withLineSDK
