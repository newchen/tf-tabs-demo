export default {
  namespace: 'bb',

  state: {
    tt: 'tt',
    dd: 'dd'
  },

  effects: {

  },

  reducers: {
    update(state, { payload }) {
      console.log('ffffff')
      return { ...state, ...payload }
    }
  },

  subscriptions: {
    setup({ history, dispatch }) {
      console.log('bb setup')

    }
  }
}