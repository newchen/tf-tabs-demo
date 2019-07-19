import modelExtend from 'dva-model-extend';

const _cached = {};
let _app = null;
let _curUrl = '';
let _history = null;

const _seps = ['@@', '@@']
export const matchReg = new RegExp(`^([a-zA-Z0-9\-\_]+)${_seps[0]}(.*)${_seps[1]}$`)

// 注册
export function registerModel(app, model, extra, index) {
  model = model.default || model;

  let ns = model.namespace
  let { match: { url, path } } = extra
  let isCurPageModel = false // 是当前页面的model, 排除父/祖节点的model

  if (path != url
    && index >= extra.index) {
    ns = getNS(ns, url)
    model = modelExtend(model, { namespace: ns });
  }

  if (index >= extra.index) {
    isCurPageModel = true
  }

  if (!_cached[ns]) {
    !_app && (_app = app)
    !_curUrl && (listen(extra.history))

    _cached[ns] = { ns, model, extra, isCurPageModel };
    app.model(model);
  }
}

// 监听路径变化
function listen(history) {
  _history = history
  _curUrl = history.location.pathname;

  history.listen(({ pathname }) => {
    _curUrl = pathname
  })
}

export function getNS(ns, url) {
  return ns + `${getUrl(url)}` 
}

export function getHistory() {
  return _history
}
export function getCurUrl() {
  return _curUrl
}

export function getCachedByUrl(url) {
  let arr = []; // 一个页面可以同时注册多个model
  
  for(let ns in _cached) {
    let cache = _cached[ns]

    if (cache && cache.isCurPageModel
      && cache.extra.match.url === url) {
      arr.push(_cached[ns])
    }
  }

  return arr;
}

export function getUrl(url) {
  return _seps[0] + url.replace(/\//g, '') + _seps[1]
}

export function getRealNS(ns) {
  let newNS =  getNS(ns, _curUrl)

  if (_cached[newNS]) return newNS

  return ns
}

export function getTitle(url) {
  let cached = getCachedByUrl(url)[0]

  if (cached) {
    let title =  cached.extra.title

    if (typeof title === 'function') {
      title = title(cached.extra.match)
    }

    return title;
  }

  return ''
}

// 注销
export function unmodel(url) {
  if (_app) {
    let cached = getCachedByUrl(url)
   
    cached.forEach(item => {
      _app.unmodel(item.model.namespace)
      _cached[item.ns] = null
      delete _cached[item.ns]
    })

    cached = null;
  }
}

