const { withAppDelegate } = require('@expo/config-plugins')

const generateCode = require('@expo/config-plugins/build/utils/generateCode')

function withCustomAppDelegate(config) {
  return withAppDelegate(config, config => {
    const withImport = generateCode.mergeContents({
      comment: '//',
      anchor: /#import "AppDelegate\.h"/,
      newSrc: '#import "react_native_line-Swift.h"',
      offset: 1,
      src: config.modResults.contents,
      tag: 'import',
    })

    const withOpenUrl = generateCode.mergeContents({
      comment: '//',
      anchor: /- \(BOOL\)application:\(UIApplication \*\)application openURL:\(NSURL \*\)url options:\(NSDictionary<UIApplicationOpenURLOptionsKey,id> \*\)options {/,
      newSrc: 'return [LineLogin application:application open:url options:options];',
      offset: 1,
      src: withImport.contents,
      tag: 'return',
    })

    return {
      ...config,
      modResults: {
        ...config.modResults,
        contents: withOpenUrl.contents,
      },
    }
  })
}

module.exports = withCustomAppDelegate
