const {
  withDangerousMod,
  withPlugins,
  IOSConfig,
  withAppBuildGradle,
  WarningAggregator,
  withInfoPlist,
  withStringsXml,
  withAndroidManifest,
} = require('@expo/config-plugins')
const { resolve } = require('path')
const { readFileSync, writeFileSync, promises } = require('fs')
const { withLineLogin } = require('./ios/withLinePluginConfig')

// Android
const { lineImplementation, compileOptions } = require('./android/constants')

// iOS
const lineCFBundleURLSchemes = {
  CFBundleURLSchemes: ['line3rdp.$(PRODUCT_BUNDLE_IDENTIFIER)'],
}

const lineLSApplicationQueriesSchemes = 'lineauth2'

const CHANNEL_ID_REPLACE = 'CHANNEL_ID_REPLACE'

// iOS mods
// Pass `<string>` to specify that this plugin requires a string property.
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

function withForcedAppDelegate(config, { channelId }) {
  return withDangerousMod(config, [
    'ios',
    async config => {
      const fileInfo = IOSConfig.Paths.getAppDelegate(
        config.modRequest.projectRoot,
      )

      // const envProfile = config.extra.env.RELEASE_STAGE ?? 'development'

      let { path } = fileInfo

      const { projectRoot } = config.modRequest

      // V1
      // const newAppDelegateFile = resolve(projectRoot, 'plugins/line-sdk/ios/', envProfile , 'appDelegate.m');
      // V2
      const newAppDelegateFile = resolve(
        projectRoot,
        'plugins/line-sdk/ios/',
        'appDelegate_template.m',
      )

      // V1
      const newAppDelegate = readFileSync(newAppDelegateFile, 'utf8')

      // V2
      const replacedAppDelegate = newAppDelegate.replace(
        CHANNEL_ID_REPLACE,
        channelId,
      )

      const oldAppDelegateFile = resolve(path)

      await promises.writeFile(oldAppDelegateFile, replacedAppDelegate)

      return config
    },
  ])
}

function withLinePod(config) {
  return withDangerousMod(config, [
    'ios',
    cfg => {
      const { platformProjectRoot } = cfg.modRequest
      const podfile = resolve(platformProjectRoot, 'Podfile')
      const contents = readFileSync(podfile, 'utf-8')
      const lines = contents.split('\n')
      const index = lines.findIndex(line => /\s+use_expo_modules!/.test(line))

      writeFileSync(
        podfile,
        [
          ...lines.slice(0, index),
          `  pod 'LineSDKSwift', '~> 5.0'`,
          ...lines.slice(index),
        ].join('\n'),
      )

      return cfg
    },
  ])
}

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

function withLineChannelId(config, { channelId }) {
  return withStringsXml(config, config => {
    let strings = config.modResults.resources.string

    let line_channel_id = strings.findIndex(
      value => value.$.name === 'line_channel_id',
    )

    if (line_channel_id !== -1) {
      // Dp nothing
      return config
    } else {
      strings.push({
        $: {
          name: 'line_channel_id',
          translatable: 'false',
        },
        _: channelId.toString(),
      })
    }

    return config
  })
}

function withLineManifest(config) {
  return withAndroidManifest(config, config => {
    let manifest = config.modResults.manifest
    let application = manifest.application

    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools'
    application[0].$['tools:replace'] = 'android:allowBackup'

    return config
  })
}

function withLineSDK(config, props) {
  if (!props?.channelId) {
    throw Error('Please specify channelId')
  }
  return withPlugins(config, [
    // iOS
    withLinePod,
    [withCustomPlist, props],
    [withLineLogin, props],
    // [withForcedAppDelegate, props],

    // Android
    withApplyLineImplementation,
    withApplyMaven,
    withLineManifest,
    withApplyAndroidCompileOptions,
    [withLineChannelId, props],
  ])
}

module.exports = withLineSDK
