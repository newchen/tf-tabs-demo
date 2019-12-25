import React from 'react';
import { setRuntime, RouteComponent } from '@/lib.js'
import config from './config/route'

// 设置runtime运行时
setRuntime(() => require('@/app'));

function RouterConfig({ history, app }) {
  return <RouteComponent routes={config} history={history} app={app}/>
}

export default RouterConfig