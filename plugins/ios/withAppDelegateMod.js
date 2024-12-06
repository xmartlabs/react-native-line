const { withAppDelegate } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode')

/*
* mergeContents doesn't work with offset <1 to put value before anchor,
* hence I made this utility function, probably unstable, use at your own risk
* */
function injectIntoContents(contents, searchAnchor, injection) {
  const openUrlInjectionIndex = contents.indexOf(searchAnchor);

  // Check if the anchor was found; if not, return contents as is
  if (openUrlInjectionIndex === -1) {
    console.warn('Search anchor not found in contents.');
    return contents;
  }

  // Calculate the insertion point
  const anchorIndex = openUrlInjectionIndex + searchAnchor.length;

  // Inject the specified code at the appropriate location
  return (
    contents.substring(0, anchorIndex) +
    injection +
    contents.substring(anchorIndex)
  );
}

const withAppDelegateMod = (config, { channelId }) => {
  return withAppDelegate(
    config,
    async (config) => {
      const appDelegate = config.modResults;

      const withHeader = mergeContents({
        anchor: /#import "AppDelegate\.h"/,
        comment: "//",
        newSrc: '#import "RNLine-Swift.h"',
        offset: 1,
        src: appDelegate.contents,
        tag: "line-header",
      });

      const withChannelIdInjection = mergeContents({
        anchor: "self.initialProps = @{};",
        comment: "//",
        newSrc: `[LineLogin setupWithChannelID:@"${channelId}" universalLinkURL:nil];`,
        offset: 1,
        src: withHeader.contents,
        tag: "line-channel-id",
      });

      //
      // Handle redirection back to the app from Line
      //
      withChannelIdInjection.contents = injectIntoContents(withChannelIdInjection.contents, `- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return`,` [LineLogin application:application open:url options:options] ||`)

      const withContinueUserActivityVariableInjection = mergeContents({
        anchor: "restorationHandler:restorationHandler];",
        comment: "//",
        newSrc: `BOOL handledLine = [LineLogin application:application continue:userActivity restorationHandler:restorationHandler];`,
        offset: 1,
        src: withChannelIdInjection.contents,
        tag: "line-continue-user-activity-variable-injection",
      });

      withChannelIdInjection.contents = injectIntoContents(withContinueUserActivityVariableInjection.contents,`] || result`, ` || handledLine` )

      return {
        ...config,
        modResults: {
          ...appDelegate,
          contents: withChannelIdInjection.contents
        }
      };
    }
  );
};

module.exports = withAppDelegateMod
