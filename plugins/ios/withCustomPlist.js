// iOS mods
// Pass `<string>` to specify that this plugin requires a string property.
const { withInfoPlist } = require('@expo/config-plugins')

// iOS
const lineCFBundleURLSchemes = {
  CFBundleURLSchemes: ['line3rdp.$(PRODUCT_BUNDLE_IDENTIFIER)'],
}

const lineLSApplicationQueriesSchemes = 'lineauth2'

function withCustomPlist(config, { channelId }) {
  return withInfoPlist(config, config => {
    config.modResults.CFBundleURLTypes?.push(lineCFBundleURLSchemes)

    let LSScheme = config.modResults.LSApplicationQueriesSchemes

    if (!LSScheme) {
      config.modResults.LSApplicationQueriesSchemes = [
        lineLSApplicationQueriesSchemes,
      ]
    } else {
      if (
        config.modResults.LSApplicationQueriesSchemes.find(
          value => value === lineLSApplicationQueriesSchemes,
        )
      ) {
        // Do nothing
      } else {
        config.modResults.LSApplicationQueriesSchemes = [
          lineLSApplicationQueriesSchemes,
        ]
      }
    }

    config.modResults.LineSDKConfig = {
      ChannelID: channelId,
    }

    return config
  })
}

module.exports = withCustomPlist