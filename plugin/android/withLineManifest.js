const { withAndroidManifest } = require('@expo/config-plugins')

function withLineManifest(config) {
  return withAndroidManifest(config, config => {
    let manifest = config.modResults.manifest
    let application = manifest.application

    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools'
    application[0].$['tools:replace'] = 'android:allowBackup'

    return config
  })
}

module.exports = withLineManifest
