import React from 'react';
import { Link } from 'dva/router'
import { Input } from 'antd'

export default (props) => {
  console.log('bb页面', props)
  return (
    <div>
      bb页面
      输入内容: <Input style={{width: '300px'}}/><br />
      <Link to="/b">跳转到b页面</Link><br />
      <Link to="/bb/3434">跳转到/bb/3434页面</Link><br />
      <Link to="/bb/123">跳转到/bb/123页面</Link><br />
    </div>
  )
}