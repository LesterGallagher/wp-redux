import createEndpoint from './endpoint-creator'
import format from './format'

export default ({ debug, base, calls, routes }) => (result, path) => {
  const route = routes[path]

  const normalizedPath = path.replace('/', '')

  const { methods, endpoints, _links } = route

  const methodReducer = (result, { methods, args }) => {
    return [
      ...result,
      ...methods.map(method => {
        const formatted = format(normalizedPath)

        const type = `${method}_${formatted}`

        const name = format(normalizedPath.replace(/\(.*?\)/g, ''))

        const url = _links !== undefined && base === undefined ? _links.self : decodeURIComponent(new URL(normalizedPath, base).href)

        const PENDING = `${type}_PENDING`
        const FULFILLED = `${type}_FULFILLED`
        const REJECTED = `${type}_REJECTED`
        const CLEAR = `${type}_CLEAR`

        return {
          [type]: createEndpoint({
            method,
            name,
            type,
            formatted,
            path: normalizedPath,
            route,
            url,
            PENDING,
            FULFILLED,
            REJECTED,
            CLEAR,
            args,
            calls
          })
        }
      })
    ]
  }

  if (!methods) {
    if (debug) console.warn(`"${path}" endpoint does not have a "methods" field. Got ${typeof methods}.`)
  } else if (typeof endpoints !== 'object' && endpoints !== null) {
    if (debug) console.warn(`"${path}" "endpoints" field should be of type "object". Got ${typeof endpoints}.`)
  } else if ((typeof _links !== 'object' || _links === null) && base === undefined) {
    if (debug) console.warn(`"${path}" "_links" field should be of type "object" (got ${typeof _links}) or the "base" option argument should be specified.`)
  } else {
    return [
      ...result,
      ...endpoints.reduce(methodReducer, [])
    ]
  }
  if (debug) console.warn('Skipping...')
  return result
}
