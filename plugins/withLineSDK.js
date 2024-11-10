const {
  withDangerousMod,
  withPlugins,
  IOSConfig,
  withInfoPlist,
} = require('@expo/config-plugins')
const { resolve } = require('path')
const { readFileSync, writeFileSync, promises } = require('fs')
const { withLineLogin } = require('./ios/withLinePluginConfig')

// Android
const withApplyLineImplementation = require('./android/withApplyLineImplementation')
const withApplyMaven = require('./android/withApplyMaven')
const withLineManifest = require('./android/withLineManifest')
const withApplyAndroidCompileOptions = require('./android/withApplyAndroidCompileOptions')
const withLineChannelId = require('./android/withLineChannelId')

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
