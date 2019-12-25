import dva from 'dva'
import createLoading from 'dva-loading';
import history from './history'
import { dynamicNS } from '@/lib.js'

let app = dva({
  history, 

  onError(e) {
    console.error('onError', e.message);
  },

  onAction: dynamicNS()
})

app.use(createLoading())

app.router(require('./router').default)

app.start('#root');
