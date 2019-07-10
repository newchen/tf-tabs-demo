import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router'
import { Input } from 'antd'

const AA = (props) => {
  let { dispatch } = props;
 console.log('aaaaaa')
  return (
    <div>
      alayout的子页面: aa
      <div>姓名: { props.name }</div>
      <div>吃: { props.eat }</div>

      输入内容: <Input style={{width: '300px'}}/><br />
      <button onClick={() => dispatch({type: 'app/fetchName'})}>改变姓名</button>

      <Link to="/b">跳转到b页面</Link>
    </div>
  )
}

export default connect((({app, aa}) => ({ ...app, ...aa })))(AA)