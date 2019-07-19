import React from 'react';
// import { connect } from 'dva';
import { Link } from 'dva/router'
import { Input, Button } from 'antd'
import { connect, getTitle, refresh, unload } from 'tf-tabs-cache'

const AA = (props) => {
  let { dispatch } = props;
 console.log('aaaaaa', props, getTitle('/aa'))
  return (
    <div>
      alayout的子页面: aa
      <div>姓名: { props.name }</div>
      <div>吃: { props.eat }</div>

      输入内容: <Input style={{width: '300px'}}/><br />
      <button onClick={() => {
        dispatch({type: 'app/fetchName'})
      }}>改变姓名</button>

      <Link to="/b">跳转到b页面</Link><br />
      <Link to="/bb/123">跳转到/bb/123页面</Link><br />

      <Button onClick={() => unload('/bb/12345')}>删除/bb/12345页面</Button>
      <Button onClick={() => unload('/bb/123')}>删除/bb/123页面</Button>
      <Button onClick={() => unload('/bb/3434')}>删除/bb/3434页面</Button>
    </div>
  )
}

export default connect((({app, aa}) => ({ ...app, ...aa })))(AA)