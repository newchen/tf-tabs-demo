export default [
  // BasicLayout布局
  {
    path: '/',
    component: () => import('../layouts/BasicLayout'),
    models: [
      () => import('../models/app')
    ],
    children: [
      { 
        path: 'aa', 
        models: [
          () => import('../pages/aa/model')
        ],
        component: () => import('../pages/aa/index') 
      },
      { path: 'bb/:id', component: () => import('../pages/bb') },
    ]
  },
  // 授权布局
  {
    path: '/auth',
    component: () => import('../layouts/AuthBasicLayout'),
    children: [
      { path: 'b', component: () => import('../pages/b') },
    ],
  },
  // 无布局
  {
    path: '/b',
    component: () => import('../pages/b')
  },
  {
    path: '/bb',
    component: () => import('../pages/bb')
  },
  // 404
  {
    component: () => import('../pages/404')
  },
]