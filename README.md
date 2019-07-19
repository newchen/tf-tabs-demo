## dva + react-router-cache-route 多标签页项目demo

### 问题
目前还有几个问题没解决

```
1. 例如路由: /user/:id, 那访问: /user/123, /user/234, /user/4545, 是希望缓存这3个页面的, 但目前有问题  --> 已解决
2. 怎么刷新 / 删除 tabs ? --> 已解决
3. 如何限制tabs打开的个数 ? --> 已解决
4. 如果支持一个路由或页面打开多次, namespace该如何注册和切换 ? --> 已解决
5. 如何获取tabs页面标题 --> 已解决
```

### 对外提供的方法

```
// 如果是/user/:id形式的路由, 可能会用到该方法, 获取当前真实的namespace
getRealNS(ns)

// 获取url地址标题
getTitle(url)

// 当前已经打开了多少个tabs页面
getCount()

// 使用方式和react-redux的connect方法一致, 如果是/user/:id形式的路由, 请使用该方法
connect(xx)(xx)

// 卸载url页面
unload(url)

// 刷新当前页面
refresh()

// RouteComponent组件, 使用参照根目录下的router.js
RouteComponent

```

### react-router-cache-route

github地址: https://github.com/CJY0208/react-router-cache-route