const { withStringsXml } = require('@expo/config-plugins')

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

module.exports = withLineChannelId
