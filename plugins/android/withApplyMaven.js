const {
  withAppBuildGradle,
  WarningAggregator,
} = require('@expo/config-plugins')

function applyMavenRepositories(appBuildGradle) {
  // TODO: Find a more stable solution for this
  if (
    appBuildGradle.includes(`repositories {
    mavenCentral()`)
  ) {
    return appBuildGradle
  } else {
    return appBuildGradle + `\nrepositories {\nmavenCentral()\n}`
  }
}

function withApplyMaven(config) {
  return withAppBuildGradle(config, config => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = applyMavenRepositories(
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

module.exports = withApplyMaven
