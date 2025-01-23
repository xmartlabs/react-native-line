const { withStringsXml } = require('@expo/config-plugins')

function withLineChannelId(config, { channelId }) {
  return withStringsXml(config, config => {
    const strings = config.modResults.resources.string

    const lineChannelId = strings.findIndex(
      value => value.$.name === 'line_channel_id',
    )

    if (lineChannelId === -1) {
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
