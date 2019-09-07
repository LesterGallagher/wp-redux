import queryString from 'query-string'

export default async (url, paramaters = {}) => {
  const href = url + '?' + queryString.stringify(paramaters, { arrayFormat: 'comma' })

  const response = await fetch(href)
  const result = await response.json()

  const toNumber = raw => +('' + raw)
  const toDate = raw => new Date('' + raw)
  const keep = raw => '' + raw

  const extraHeaders = {
    'x-wp-total': toNumber,
    'x-wp-totalpages': toNumber,
    date: toDate,
    link: keep,
    status: toNumber
  }

  const headers = Object.keys(extraHeaders)
    .filter(header => response.headers.has(header))
    .map(header => ({ [header]: extraHeaders[header](response.headers.get(header)) }))

  return {
    result,
    extra: Object.assign({}, ...headers)
  }
}
