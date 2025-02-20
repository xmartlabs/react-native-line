const { withInfoPlist } = require('@expo/config-plugins')

const CFBundleURL = 'line3rdp.$(PRODUCT_BUNDLE_IDENTIFIER)'
const LSApplicationQuery = 'lineauth2'

function withCustomInfoPlist(config) {
  return withInfoPlist(config, config => {
    const CFBundleURLTypes = config.modResults.CFBundleURLTypes
    const LSApplicationQueriesSchemes = config.modResults.LSApplicationQueriesSchemes

    if (!CFBundleURLTypes) {
      config.modResults.CFBundleURLTypes = [CFBundleURL]
    } else if (!CFBundleURLTypes.includes(CFBundleURL)) {
      config.modResults.CFBundleURLTypes.push({ CFBundleURLSchemes: [CFBundleURL] })
    }

    if (!LSApplicationQueriesSchemes) {
      config.modResults.LSApplicationQueriesSchemes = [LSApplicationQuery]
    } else if (!LSApplicationQueriesSchemes.includes(LSApplicationQuery)) {
      config.modResults.LSApplicationQueriesSchemes.push(LSApplicationQuery)
    }

    return config
  })
}

module.exports = withCustomInfoPlist
