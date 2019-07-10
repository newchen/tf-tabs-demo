import { fetchEat } from './service'

export default {
  namespace: 'aa',

  state: {
    eat: '',
  },

  effects: {
    *fetchEat({ payload }, { call, put, select }) {
      let data = yield call(fetchEat)
      
      yield put({
        type: 'upadte',
        payload: { eat: data.data }
      })
    },
  },

  reducers: {
    upadte(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  subscriptions: {
    setup({ history, dispatch }) {
      console.log('aa setup')

      history.listen(({ pathname }) => {
        console.log('listen: ',pathname)
      })

      dispatch({
        type: 'fetchEat',
        payload: 12
      })
    }
  }
}