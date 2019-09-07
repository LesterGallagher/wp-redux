import createReduxInfra from '../lib/index'
import fetch from 'node-fetch'
import 'whatwg-fetch'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const mockDataFetch = fetch('https://happylifefestival.nl/wp-json/wp/v2')
const json = mockDataFetch.then(res => res.json())
const endpointsPromise = json.then(result => createReduxInfra(result, {}, { base: 'https://happylifefestival.nl/wp-json/' }))

test('Test reducers', async () => {
  const endpoints = await endpointsPromise

  const { GET_WP_V2_PAGES_ID, rootReducer } = endpoints

  const fetchPage = GET_WP_V2_PAGES_ID.actionCreator

  const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
  )

  const pageId = 5394

  store.subscribe(() => {
    const state = store.getState()

    if (state.wpV2Pages.list.length > 0) expect(state.wpV2Pages.list[0].id).toBe(pageId)
  })

  await store.dispatch(fetchPage({ id: pageId }))
})
