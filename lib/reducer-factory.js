import { combineReducers } from 'redux'
import camelCase from './camelcase'

export default endpoints => {
  const names = {}

  const keys = Object.keys(endpoints)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const endpoint = endpoints[key]

    if (endpoint.method === 'GET') {
      if (endpoint.name in names) {
        names[endpoint.name].push(endpoint)
      } else {
        names[endpoint.name] = [endpoint]
      }
    }
  }

  return combineReducers(
    Object.assign(
      {},
      ...Object.keys(names).map(name => {
        const endpoints = names[name]
        const camelCaseName = camelCase(name.toLowerCase())
        const value = createReducer(endpoints)

        return {
          [camelCaseName]: value
        }
      })
    )
  )
}

const createReducer = (endpoints) => {
  const initialState = {
    list: [],
    isLoading: false,
    error: null
  }

  return (state = initialState, { type, payload, meta }) => {
    for (let i = 0; i < endpoints.length; i++) {
      const {
        PENDING,
        REJECTED,
        FULFILLED,
        CLEAR
      } = endpoints[i];

      switch (type) {
        case PENDING: {
          return Object.assign(state, {
            isLoading: true
          })
        }

        case REJECTED: {
          return Object.assign(state, {
            isLoading: false,
            error: payload
          })
        }

        case FULFILLED: {
          return Object.assign(state, {
            isLoading: false,
            list: [
              ...state.list,
              ...(Array.isArray(payload.result) ? [...payload.result] : [payload.result])
            ]
          })
        }

        case CLEAR: {
          return Object.assign(state, {
            list: [],
            error: null
          })
        }
      }
    }

    return state
  }
}
