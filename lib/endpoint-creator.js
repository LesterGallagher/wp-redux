export default ({ method, type, path, formatted, route, name, url, PENDING, FULFILLED, REJECTED, CLEAR, args, calls }) => {
  return {
    method,
    type,
    PENDING,
    FULFILLED,
    REJECTED,
    CLEAR,
    path,
    name,
    formatted,
    route,
    url,
    actionCreator: (payload = {}) => async dispatch => {
      const href = url.replace(/\(.+<([^>]+)>.+\)/g, (full, name, t) => {
        return payload[name]
      })

      const defaultValues = Object.assign(
        ...Object.keys(args)
          .filter(arg => 'default' in args[arg])
          .map(arg => ({ [arg]: args[arg].default }))
      )

      payload = Object.assign({}, defaultValues, payload)

      const missing = Object.keys(args)
        .filter(arg =>
          args[arg].isRequired &&
          !(arg in payload)
        )
        .map(arg => 'description' in args[arg] ? arg + '(' + args[arg].description + ')' : arg)
        .map(arg => 'type' in args[arg] ? arg + ':' + args[arg].type : arg)
        .join(', ')
      if (missing.length > 0) {
        throw new Error(`Missing the following arguments while executing the ${type} action creator: ${missing}`)
      }

      if (!(method in calls)) {
        throw new Error(`method: "${method}" is not valid, it should be one of "${Object.keys(calls).join(', ')}"`)
      }

      dispatch({
        type: PENDING,
        meta: payload
      })

      let result

      try {
        result = await calls[method](href, payload)
      } catch (error) {
        dispatch({
          type: REJECTED,
          meta: payload,
          payload: error
        })

        throw error
      }

      dispatch({
        type: FULFILLED,
        meta: payload,
        payload: result
      })
    }
  }
}
