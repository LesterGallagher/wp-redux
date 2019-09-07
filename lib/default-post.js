import queryString from 'query-string'

export default async (url, paramaters = {}, payload = {}) => {
  const href = url + '?' + queryString.stringify(paramaters, { arrayFormat: 'comma' })
  const response = await fetch(href, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const result = await response.json()

  const headers = [
    'date',
    'link',
    'status'
  ]
    .map(header => response.headers.has(header))
    .map(header => ({ [header]: response.headers.get(header) }))

  return {
    result,
    extra: { ...headers }
  }
}
