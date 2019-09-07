export default str => str
  .replace(/[^a-z0-9]+(.)/gi, function ($1, $2) { return $2.toUpperCase() })
  .replace(/\s/g, '')
  .replace(/^(.)/, function ($1) { return $1.toLowerCase() })
