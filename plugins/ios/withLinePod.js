const { withDangerousMod } = require('@expo/config-plugins')
const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')

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
          `  pod 'LineSDKSwift', '~> 5.8.1'`,
          ...lines.slice(index),
        ].join('\n'),
      )

      return cfg
    },
  ])
}

module.exports = withLinePod