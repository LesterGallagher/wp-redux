import defaultGet from './default-get'
import defaultPost from './default-post'
import endpointReducerFactory from './endpoint-reduce';
import reduxReducerFactory from './reducer-factory';

export default ({
  routes
}, {
  get = defaultGet,
  post = defaultPost,
  put,
  del
} = {}, {
  debug = true,
  base
} = {}) => {
  if (base && debug && !base.endsWith('/wp-json/')) {
    console.warn('The "base" arguments value should probably be url ending with "/wp-json/"')
  }

  if (typeof routes !== 'object' && routes !== null) {
    throw new Error('"routes" paramater should be be of type array.')
  }

  const calls = {
    POST: post,
    GET: get,
    PUT: put,
    DELETE: del
  }

  const endpointArrayReducer = endpointReducerFactory({ debug, base, calls, routes });

  const endpoints = Object.assign(
    {},
    ...Object.keys(routes).reduce(endpointArrayReducer, []),
  )

  const ret = {
    ...endpoints,
    rootReducer: reduxReducerFactory(endpoints)
  }

  return ret;
}
