import dva from 'dva'
import createLoading from 'dva-loading';
import history from '@/utils/history'

let app = dva({
  history, 

  onError(e) {
    console.error('onError', e.message);
  },
})

app.use(createLoading())

app.router(require('./router').default)

app.start('#root');