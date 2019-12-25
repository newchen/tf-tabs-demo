/*
  支持页面缓存, 支持多层嵌套, 支持加载component和model
  实现: https://umijs.org/zh/guide/runtime-config.html
  目前实现了: setRuntime, patchRoutes, render, onRouteChange 运行时方法
*/

import React, { useState, useEffect } from 'react';
import { Router/*, Route, Switch*/, Redirect } from 'react-router-dom'
// import { Router/*, Route, Switch*/, Redirect } from 'react-router-dom'
import Route, { CacheSwitch as Switch, dropByCacheKey } from 'react-router-cache-route'
import dynamic from './dynamic'
import pathToRegexp from 'path-to-regexp'
import MultiComponent from './MultiComponent'
import queryString from 'query-string'

// 实现: https://umijs.org/zh/guide/runtime-config.html
// 目前实现了下面3个运行时方法
let patchRoutes = (routes) => routes
let render = (oldRender) => oldRender()
let onRouteChange = ({ location, routes, action }) => {}

function resolve(path) {
  return path.replace('./', '')
}

// 设置runtime运行时
export function setRuntime(pathOrConfig) {
  let config = pathOrConfig

  try {
    if(typeof(pathOrConfig) === 'string') {
      config = require('@/' + resolve(pathOrConfig))
    }
  } catch(e) {
    throw new Error(`
      setRuntime方法, 如果参数是字符串类型: 
        1.需配置webpack别名src为@, 
        2.路径是相对于src的, 例如src下的app.js, 只需填写'app'或'./app'即可`
    )
  }
  patchRoutes = config.patchRoutes || patchRoutes;
  render = config.render || render
  onRouteChange = config.onRouteChange || onRouteChange
}

const _cached = {} // 缓存: 组件, 对应的path

// 删除缓存的组件
export function dropCachedByUrl(url) {
  let obj = getAlinkUrl(url)

  if (obj.count === 1
    && obj.path) {
    dropByCacheKey(obj.path)
  }

  _cached[url] = null;
  delete _cached[url]
}

// 已经载入了多少个页面
export function getCount() {
  return Object.keys(_cached).length
}

// 相似的url数
export function getAlinkUrl(url) {
  let count = 0;
  if (! _cached[url]) return { count }

  let { path: curPath } =  _cached[url]

  for(let i in _cached) {
    let { path } = _cached[i]

    if (curPath === path) {
      count++
    }
  }

  return { count, path: curPath };
}

// 是否有缓存, 有缓存取缓存的
function getCachedComponent(match, Component) {
  let { url, path } = match;

  if (!_cached[url]) {
    _cached[url] = { Component, path }
  }

  // 这种路由: /user/:id
  if (url !== path) {
    let arr = [];

    for(let key in _cached) {
      let regexp = pathToRegexp(path)

      if (regexp.exec(key)) {
        let style = {}

        if (url !== key) {
          style = { display: 'none' }
        }

        arr.push(
          React.createElement(
            MultiComponent, 
            { key, style }, 
            _cached[key].Component
          )
        )
      }
    }

    if (arr.length > 0) {
      return arr;
    }
  }

  return _cached[url].Component
}

function getRoute(path, app, route, parentRoute ) {
  return (
    <Route exact 
      when="always"
      key={path} 
      path={path} 
      cacheKey={path}
      render={
        (props) => {
          return getCachedComponent(
            props.match, 
            getComponent( app, route, parentRoute, props )
          )
        }
      }
    />
  )
}

function getComponent( app, route, parentRoute, props ) {
  let { models = [], component } = route
  let { 
    component: parentComponent, 
    models: parentModels = [] 
  } = parentRoute

  // index表示从哪个位置开始是当前model
  let extra = { ...route, ...props, index: 0 }

  if (parentComponent) {
    extra.index = parentModels.length;

    return (
      parentComponent // 这里是重点
        .concat(React.createElement(
          dynamic({
            app,
            extra,
            // 注意: 这里直接全量加载所有需要的model, 而不是按需只加载当前页面的model, 因为这样的话, 页面执行的时候会报错(父组件的model这时候还没加载执行)
            models: () => {
              return [...parentModels, ...models].map(item => item()) 
            },
            component
          }), props))
        .reverse()
        .reduce((pre, cur) => {
          return React.createElement( 
            dynamic({
              app,
              component: cur
            }), props, pre )
        })
    )
  } else {
    return (
      React.createElement(
        dynamic({
          app,
          extra,
          models: () => models.map(v => v()),
          component
        }),
        props
      )
    )
  }
}

function joinPath(parentPath, path) {
  if(!parentPath) return path;

  if (path.charAt(0) === '/') {
    return path
  }

  if (parentPath.slice(-1) !== '/') {
    parentPath = parentPath + '/'
  }

  return parentPath + path;
}

function handleRoutes(routes) {
  function travel(routes, parentPath) {
    routes.forEach((route) => {
      // path默认为*, 表示匹配任意路径
      const { path = '*', children, redirect } = route;
      let fullPath = joinPath(parentPath, path)

      route.path = fullPath

      if (redirect) {
        route.redirect = joinPath(parentPath, redirect)
      }

      if( Array.isArray(children) ) {
        travel(children, fullPath)
      }
    })
  }

  travel(routes)
  // patchRoutes运行时
  return patchRoutes(routes) || routes
}

function getRouteComponents(routes, app) {
  let routesArr = [];

  function travelRoutes(routes, parentRoute = {}) {
    routes.forEach((route) => {
      const { path, redirect, children, component, models = [] } = route;

      const { 
        component: parentComponent, 
        models: parentModels = []
      } = parentRoute

      if(redirect) {
        routesArr.push(
          <Redirect 
            key={path} 
            exact 
            from={path} to={redirect}
          />
        )
      }

      let hasChildren = Array.isArray(children) && children.length > 0
      let hasParent = !!parentComponent

      if(component) {
        if (hasParent && !hasChildren) {
          routesArr.push( getRoute(path, app, route, parentRoute) ) 
        } else if (!hasChildren) {
          routesArr.push( getRoute(path, app, route, {}) ) 
        }
      }

      if(hasChildren) {
        travelRoutes(children, {
          ...route,

          component: hasParent ? // 这里是重点
            parentComponent.concat(component) : // component每个路由只有一个
            [ component ],

          models: hasParent ?
            // [ models ].concat([ parentModels ]) :// models每个路由可以是多个
            [ ...parentModels, ...models ] : 
            models,

          path
        })
      }
    })
  }

  travelRoutes(routes)

  return routesArr;
}

function handleLoc(location) {
  return {
    ...location,
    query: queryString.parse(location.search)
  }
}

function handleRouteChange(history, routes) {
  history.listen((location, action) => {
    onRouteChange({ location: handleLoc(location), routes, action })
  })

  onRouteChange({ 
    location: handleLoc(history.location), 
    routes, 
    action: undefined 
  })
}

export function RouteComponent(props) {
  let routes = handleRoutes(props.routes)

  handleRouteChange(props.history, routes)

  return (
    <Router history={props.history}>
        <Switch>
          {/* 
            // 原理
            <Route exact path='/b' component={asyncComponent(() => import('./b'))}/>
            <Route exact path='/bb' component={asyncComponent(() => import('./bb'))}/>

            // 或
            <Route exact path='/b' render={
              (props) => {
                let Comp = getCachedComponent('/b', asyncComponent(() => import('../pages/b')))
                return React.createElement(Comp, props)
              }
            }/>
            <Route exact path='/bb' render={
              (props) => {
                let Comp = getCachedComponent('/bb', asyncComponent(() => import('../pages/bb')))
                return React.createElement(Comp, props)
              }
            }/>
          */}

          {/* { getRoutes(props.routes, props.app) } */}
          { getRouteComponents(routes, props.app) }
        </Switch>
    </Router>
  )
}

// export default RouteComponent

export default (props) => {
  let [ Comp, setComp ] = useState(null)

  useEffect(() => {
    // render 运行时
    render(() => setComp(<RouteComponent {...props}/>))
  }, [])

  return Comp
}