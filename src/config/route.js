import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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
        title: 'aa页面标题',
        models: [
          () => import('../pages/aa/model')
        ],
        component: () => import('../pages/aa/index') 
      },
      { 
        path: 'bb/:id', 
        title: (data) => {
          console.log('title:',data)
          return 'bb/:id页面标题'
        }, 
        models: [
          () => import('../pages/bb/model')
        ],
        component: () => import('../pages/bb/index') 
      },
    ]
  },
  // 授权布局
  {
    path: '/auth',
    component: () => import('../layouts/AuthBasicLayout'),
    children: [
      { path: 'b', title: '授权b页面标题', component: () => import('../pages/b') },
    ],
  },
  // 无布局
  {
    path: '/b',
    title: 'b页面标题',
    component: () => import('../pages/b')
  },
  {
    path: '/bb',
    title: 'bb页面标题',
    component: () => import('../pages/bb/')
  },
  { 
    path: '/aaa', 
    title: 'aaa页面标题',
    models: [
      () => import('../pages/aa/model')
    ],
    component: () => import('../pages/aa/index') 
  },
  // 404
  {
    component: () => import('../pages/404')
  },
]