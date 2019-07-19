import { fetchInit, fetchName } from '../services/app'

export default {
  namespace: 'app',

  state: {
    name: 'xxx',
    init: 12
  },

  effects: {
    *fetchInit({ payload }, { call, put }) {
      let data = yield call(fetchInit, payload)

      yield put({
        type: 'update',
        payload: { init: data.data }
      })
    },
    *fetchName({ payload }, { call, put }) {
      let data = yield call(fetchName);
      
      yield put({
        type: 'update',
        payload: { name: data.data }
      })
    }
  },

  reducers: {
    update(state, { payload }) {
      console.log('app update', payload)
      return { ...state, ...payload }
    }
  },

  subscriptions: {
    setup({ history, dispatch }) {
      console.log('app setup');

      dispatch({
        type: 'fetchInit',
        payload: 12
      })
    }
  }
}