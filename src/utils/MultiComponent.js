import React, { Component } from 'react'

export default class MultiComponent extends Component {
  render() {
    // 需要加个div包裹, 用来设置display样式
    return (
      <div style={this.props.style}>
        <Multi 
          {...this.props} 
          style={() => this.props.style} // 用方法, 值才是对的
        />
      </div>
    )
  }
}

class Multi extends Component {
  shouldComponentUpdate() {
    let { style = () => {} } = this.props

    if (style().display === 'none') {
      return false;
    }

    return true
  }
  render() {
    return <>{this.props.children}</>
  }
}