// 支持页面缓存, 支持多层嵌套, 支持加载component和model

import React from 'react';
import { Router/*, Route, Switch*/, Redirect } from 'react-router-dom'
import Route, { CacheSwitch as Switch } from 'react-router-cache-route'
import dynamic from 'dva/dynamic'

const cachedComponent = {} // 缓存的组件

// 是否有缓存, 有缓存取缓存的
function getCachedComponent(key, Component) {
  if (!cachedComponent[key]) {
    cachedComponent[key] = Component
  }

  return cachedComponent[key]
}

function getRoute(fullPath, app, route, parentRoute ) {
  return (
    <Route exact 
      when="always"
      key={fullPath} 
      path={fullPath} 
      render={
        (props) => {
          return getCachedComponent(
            props.match.url, 
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

  if (parentComponent) {
    return (
      parentComponent // 这里是重点
        .concat(React.createElement(
          dynamic({
            app,
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
          models,
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