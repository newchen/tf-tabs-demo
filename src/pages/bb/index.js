import React from 'react';
import { Link } from 'dva/router'
import { Input, Button } from 'antd'
// import { connect } from 'dva'
import { connect, getTitle, refresh, unload } from '@/utils/'

function BB(props) {
  console.log('bb页面', props)

  let { dispatch, match: {url} } = props
  console.log('--------', getTitle(url))

  return (
    <div>
      bb页面
      输入内容: <Input style={{width: '300px'}}/><br />
      
      <div>
        <p>dd值:{props.dd}</p>
        <button onClick={() => dispatch({ type: 'bb/update', payload: {dd: +new Date}})}>改变dd的值</button>
      </div>

      <Link to="/b">跳转到b页面</Link><br />
      <Link to="/bb/3434">跳转到/bb/3434页面</Link><br />
      <Link to="/bb/123">跳转到/bb/123页面</Link><br />
      <Link to="/bb/12345">跳转到/bb/12345页面</Link><br />
      <Link to="/aa">跳转到/aa页面</Link><br />

      <Button onClick={() => refresh()}>刷新</Button>
      <Button onClick={() => unload('/aa')}>删除/aa页面</Button>
    </div>
  )
}


export default connect((({app, bb}) => ({ ...app, ...bb })))(BB)
