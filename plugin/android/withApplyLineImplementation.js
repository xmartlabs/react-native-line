const {
  withAppBuildGradle,
  WarningAggregator,
} = require('@expo/config-plugins')
const { lineImplementation } = require('./constants')

// Android mods
// https://developers.line.biz/en/docs/android-sdk/integrate-line-login/#import-library-into-your-project
function applyLineImplementation(appBuildGradle) {
  // TODO: Find a more stable solution for this
  if (!appBuildGradle.includes(lineImplementation)) {
    return appBuildGradle.replace(
      /dependencies\s?{/,
      `dependencies {
    ${lineImplementation}`,
    )
  } else {
    return appBuildGradle
  }
}

function withApplyLineImplementation(config) {
  return withAppBuildGradle(config, config => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = applyLineImplementation(
        config.modResults.contents,
      )
    } else {
      WarningAggregator.addWarningAndroid(
        'react-native-line',
        `Cannot automatically configure app build.gradle if it's not groovy`,
      )
    }
    return config
  })
}

module.exports = withApplyLineImplementation
