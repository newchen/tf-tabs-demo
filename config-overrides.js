const {
  override,
  fixBabelImports,
  addLessLoader,
  useBabelRc
} = require("customize-cra");

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = function(config, env) {
  if (env === 'production') {
    // config.output.publicPath =  '/s/npm/form-fields/'
  }

  // 别名
  config.resolve.alias = {
    '@': resolve('src')
  }

  return override(
    fixBabelImports("import", {
      libraryName: "antd", libraryDirectory: "es", style: true //如果你在使用 babel-plugin-import 的 style 配置来引入样式，需要将配置值从 'css' 改为 true，这样会引入 less 文件。
    }),
    
    addLessLoader({
      javascriptEnabled: true,
      // modifyVars: { "@primary-color": "#1DA57A" }
    }),

    useBabelRc()
  )(config, env)
}

