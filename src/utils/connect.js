import { connect as connection } from 'dva';
import { getUrl, matchReg } from './model'

function proxyReflect(state, ownerProps) {
  state = { ...state }
  
  let { match: { url }} = ownerProps
  let reg = matchReg;
  let arr = [];

  for(let key in state) {
    if (key.indexOf(getUrl(url)) > 0) {
      let match = reg.exec(key);

      if(match) {
        arr.push({ key, ns: match[1] })
      }
    } 
  }

  if(arr.length > 0) { 
    arr.forEach( v => {
      if (!state[v.ns] && state[v.key]) {
        Object.defineProperty(state, v.ns, {
          get() {
            return state[v.key]
          }
        })
      }
    })
  }

  return state;
}

// 重写connect方法
export function connect(...rest) {
  let mapStateToProps = rest.shift()

  function mapStateToPropsProxy(state, ownerProps) {
    state = proxyReflect(state, ownerProps);
    return mapStateToProps(state, ownerProps)
  }

  rest.unshift(mapStateToPropsProxy);

  return function () {
    return connection.apply(null, rest).apply(null, arguments);
  };
}

export default connect