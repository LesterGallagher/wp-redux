export default (string = '') => string
  .replace(/(\\d|\?p)/gi, '')
  .replace(/[^a-z1-9_/\\-]+/gi, '')
  .replace(/[_/\\-]+/g, '_')
  .replace(/(^_|_$)/g, '')
  .toUpperCase()
