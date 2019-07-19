import { getRealNS } from './model';

// 动态namespace中间件
function dynamicNs() {
  return () => (next) => (action) => {
    let arr = action.type.split('/');
    let ns = getRealNS(arr.shift());

    arr.unshift(ns);
    action.type = arr.join('/');
    next(action);
  };
}

export default dynamicNs;
