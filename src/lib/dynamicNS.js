import { getRealNS } from './model';

// 动态namespace中间件
export function dynamicNS() {
  return () => (next) => (action) => {
    let arr = action.type.split('/');
    let ns = getRealNS(arr.shift());

    arr.unshift(ns);
    action.type = arr.join('/');
    next(action);
  };
}

export default dynamicNS;
