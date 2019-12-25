import { unmodel, getCurUrl, getHistory  } from './model'
import { dropCachedByUrl } from './routeComponent'

// 对外方法
export {  getRealNS, getTitle } from './model'
export { default as RouteComponent, getCount, setRuntime } from './routeComponent'
export { connect } from './connect'
export { dynamicNS } from './dynamicNS'

// 卸载
export function unload(url) {
  unmodel(url)
  dropCachedByUrl(url)
}

// 刷新当前页面
export function refresh() {
  let url = getCurUrl()

  unload(url)
  getHistory().push(url)
}