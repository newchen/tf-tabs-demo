import React from 'react';
import { Link } from 'dva/router'
import { Input } from 'antd'

export default (props) => {
  console.log(props)
  
  return (
    <div>
      bbbbb
      输入内容: <Input style={{width: '300px'}}/><br />
      <Link to="/a/aa">跳转到aa页面</Link><br/>
      <Link to="/bb">跳转到bb页面</Link><br/>
      <Link to="/bb/123">跳转到bb/123页面</Link><br/>
    </div>
  )
}