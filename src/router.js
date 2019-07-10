import React from 'react';
import {RouteComponent} from '@/utils/routeComponent'
import config from './config/route'

function RouterConfig({ history, app }) {
  return <RouteComponent routes={config} history={history} app={app}/>
}

export default RouterConfig