const { withAppDelegate } = require('@expo/config-plugins')

const generateCode = require('@expo/config-plugins/build/utils/generateCode')

function selectStrings(language) {
  if (language === 'swift') {
    return {
      import: {
        anchor: /import\s+Expo/,
        newSrc: 'import react_native_line',
      },
      return: {
        anchor: /return\s+super\.application\(\s*app,\s*open:\s*url,\s*options:\s*options\s*\)\s*\|\|\s*RCTLinkingManager\.application\(\s*app,\s*open:\s*url,\s*options:\s*options\s*\)/,
        newSrc: '    return LineLogin.application(app, open: url, options: options)',
        offset: 0,
      },
    }
  } else {
    return {
      import: {
        anchor: /#import\s+"AppDelegate\.h"/,
        newSrc: '#import "react_native_line-Swift.h"',
      },
      return: {
        anchor: /-\s*\(BOOL\)\s*application:\s*\(UIApplication\s*\*\)\s*application\s+openURL:\s*\(NSURL\s*\*\)\s*url\s+options:\s*\(NSDictionary<UIApplicationOpenURLOptionsKey,\s*id>\s*\*\)\s*options\s*\{/,
        newSrc: '  return [LineLogin application:application open:url options:options];',
      },
    }
  }
}

function withCustomAppDelegate(config) {
  return withAppDelegate(config, config => {
    const strings = selectStrings(config.modResults.language)

    const withImport = generateCode.mergeContents({
      comment: '//',
      offset: 1,
      src: config.modResults.contents,
      tag: 'import',
      ...strings.import,
    })

    const withOpenUrl = generateCode.mergeContents({
      comment: '//',
      offset: 1,
      src: withImport.contents,
      tag: 'linking',
      ...strings.return,
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
