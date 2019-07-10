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
        type: 'upadte',
        payload: { init: data.data }
      })
    },
    *fetchName({ payload }, { call, put }) {
      let data = yield call(fetchName);
      
      yield put({
        type: 'upadte',
        payload: { name: data.data }
      })
    }
  },

  reducers: {
    upadte(state, { payload }) {
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