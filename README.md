## dva + react-router-cache-route 多标签页项目demo

### 依赖组件

[tf-tabs-cache](https://www.npmjs.com/package/tf-tabs-cache), [react-router-cache-route](https://github.com/CJY0208/react-router-cache-route)

### 已解决的问题

```
1. 例如路由: /user/:id, 那访问: /user/123, /user/234, /user/4545, 是希望缓存这3个页面的
2. 怎么刷新 / 删除 tabs ? 
3. 如何限制tabs打开的个数 ?
4. 如果支持一个路由或页面打开多次, namespace该如何注册和切换 ? 
5. 如何获取tabs页面标题 
```
