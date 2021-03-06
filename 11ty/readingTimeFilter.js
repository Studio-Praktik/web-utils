// https://github.com/johanbrook/eleventy-plugin-reading-time
module.exports = function (eleventyConfig, pluginNamespace) {
  eleventyConfig.namespace(pluginNamespace, () => {
    eleventyConfig.addFilter('readingTime', (
      postOrContent,
      { printSeconds = false, raw = false, speed = 300, minuteLabel, secondLabel, pluralize = true } = {}
    ) => {
      const htmlContent =
        typeof postOrContent === 'string'
          ? postOrContent
          : postOrContent.templateContent

      if (!htmlContent) {
        return `0 ${printSeconds ? (secondLabel || 'seconds') : (minuteLabel || 'minutes')}`
      }

      const content = htmlContent.replace(/(<([^>]+)>)/gi, '')
      const matches = content.match(/[\u0400-\u04FF]+|\S+\s*/g)
      const count = matches !== null ? matches.length : 0

      let est

      if (printSeconds === true) {
        const min = Math.floor(count / speed)
        const sec = Math.floor((count % speed) / (speed / 60))

        if (raw === false) {
          const mins = min + ' ' + (minuteLabel || 'minute') + ((pluralize && min !== 1 ? 's' : '')) + ', '
          const secs = sec + ' ' + (secondLabel || 'second') + ((pluralize && sec !== 1 ? 's' : ''))
          est = min > 0 ? mins + secs : secs
        } else {
          est = min * 60 + sec
        }
      } else {
        const min = Math.ceil(count / speed)

        if (raw === false) {
          est = min + ' ' + (minuteLabel ? minuteLabel + ((pluralize && min !== 1 ? 's' : '')) : 'min')
        } else {
          est = min
        }
      }

      return est
    })
  })
}