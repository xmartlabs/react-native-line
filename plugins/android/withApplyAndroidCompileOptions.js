const {
  withAppBuildGradle,
  WarningAggregator,
} = require('@expo/config-plugins')
const { compileOptions } = require('./constants')

// https://developers.line.biz/en/docs/android-sdk/integrate-line-login/#add-android-compilation-options
function applyCompileOptions(appBuildGradle) {
  // TODO: Find a more stable solution for this
  if (!appBuildGradle.includes(compileOptions)) {
    return appBuildGradle.replace(
      /android\s?{/,
      `android {
    ${compileOptions}`,
    )
  } else {
    return appBuildGradle
  }
}

function withApplyAndroidCompileOptions(config) {
  return withAppBuildGradle(config, config => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = applyCompileOptions(
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

module.exports = withApplyAndroidCompileOptions
