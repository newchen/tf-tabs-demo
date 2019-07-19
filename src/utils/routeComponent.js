// 支持页面缓存, 支持多层嵌套, 支持加载component和model

import React from 'react';
import { Router/*, Route, Switch*/, Redirect } from 'react-router-dom'
// import { Router/*, Route, Switch*/, Redirect } from 'react-router-dom'
import Route, { CacheSwitch as Switch, dropByCacheKey } from 'react-router-cache-route'
import dynamic from './dynamic'
import pathToRegexp from 'path-to-regexp'
import MultiComponent from './MultiComponent'

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

function getRoute(fullPath, app, route, parentRoute ) {
  return (
    <Route exact 
      when="always"
      key={fullPath} 
      path={fullPath} 
      cacheKey={fullPath}
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

function getRoutes(routes, app) {
  let routesArr = [];

  function travelRoutes(routes, parentRoute = {}) {
    routes.forEach((route) => {
      // path默认为*, 表示匹配任意路径
      const { path = '*', redirect, children, component, models = [] } = route;

      const { 
        path: parentPath = '', 
        component: parentComponent, 
        models: parentModels = []
      } = parentRoute

      let fullPath = joinPath(parentPath, path)

      if(redirect) {
        routesArr.push(
          <Redirect 
            key={fullPath} 
            exact 
            from={path} to={joinPath(parentPath, redirect)}
          />
        )
      }

      let hasChildren = Array.isArray(children) && children.length > 0
      let hasParent = !!parentComponent

      if(component) {
        if (hasParent && !hasChildren) {
          routesArr.push( getRoute(fullPath, app, route, parentRoute) ) 
        } else if (!hasChildren) {
          routesArr.push( getRoute(fullPath, app, route, {}) ) 
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

          path: fullPath
        })
      }
    })
  }

  travelRoutes(routes)

  return routesArr;
}

export function RouteComponent(props) {
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

          { getRoutes(props.routes, props.app) }
        </Switch>
    </Router>
  )
}

export default RouteComponent