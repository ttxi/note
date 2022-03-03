---
sidebarDepth: 2
---

# webpack介绍
webpack是一个JavaScript 应用程序的静态模块打包工具
webpack

## 1.1 安装
npm install  webpack webpack-cli --save-dev
### 1.2 入口(entry)
入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph) 的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的
默认值是 ./src/index.js，但你可以通过在 webpack configuration 中配置 entry 属性，来指定一个（或多个）不同的入口起点
1.2.1 src\index.js
import './index.css'
1.2.2 index.css
body{
  background-color:green;
}
1.2.3 webpack.config.js
const path = require('path');
module.exports = {
  entry: './src/index.js',
};
1.3 输出(output)
output 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件
主要输出文件的默认值是 ./dist/main.js，其他生成文件默认放置在 ./dist 文件夹中。
webpack.config.js

const path = require('path');
module.exports = {
  entry: './src/index.js',
+  output: {
+    path: path.resolve(__dirname, 'dist'),
+    filename: 'main.js'
+  }
};
1.4 loader
webpack 只能理解 JavaScript 和 JSON 文件
loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中
webpack.config.js

const path = require('path');
module.exports = {
  mode: 'development',
  devtool:false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
+  module: {
+    rules: [
+      { test: /\.css$/, use: ['style-loader','css-loader']}
+    ]
+  }
};
1.5 插件(plugin)
loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量
1.5.1 src\index.html
src\index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack5</title>
</head>
<body>
</body>
</html>
```
1.5.2 webpack.config.js
```js
const path = require('path');
+const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool:false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader','css-loader']}
    ]
  },
+  plugins: [
+    new HtmlWebpackPlugin({template: './src/index.html'})
+  ]
};
```
### 1.6 模式(mode)
日常的前端开发工作中，一般都会有两套构建环境
一套开发时使用，构建结果用于本地开发调试，不进行代码压缩，打印 debug 信息，包含 sourcemap 文件
一套构建后的结果是直接应用于线上的，即代码都是压缩后，运行时不打印 debug 信息，静态文件不包括 sourcemap
webpack 4.x 版本引入了 mode 的概念
当你指定使用 production mode 时，默认会启用各种性能优化的功能，包括构建结果优化以及 webpack 运行性能优化
而如果是 development mode 的话，则会开启 debug 工具，运行时打印详细的错误信息，以及更加快速的增量编译构建
选项	描述
development	会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin
production	会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin
1.6.1 环境差异
开发环境
需要生成 sourcemap 文件
需要打印 debug 信息
需要 live reload 或者 hot reload 的功能
生产环境
可能需要分离 CSS 成单独的文件，以便多个页面共享同一个 CSS 文件
需要压缩 HTML/CSS/JS 代码
需要压缩图片
其默认值为 production
1.6.2 区分环境
--mode用来设置模块内的process.env.NODE_ENV
--env用来设置webpack配置文件的函数参数
cross-env用来设置node环境的process.env.NODE_ENV
DefinePlugin用来设置模块内的全局变量
1.6.2.1 命令行配置1
webpack的mode默认为production
webpack serve的mode默认为development
可以在模块内通过process.env.NODE_ENV获取当前的环境变量,无法在webpack配置文件中获取此变量
  "scripts": {
    "build": "webpack",
    "start": "webpack serve"
  },
index.js

console.log(process.env.NODE_ENV);// development | production
webpack.config.js

console.log('NODE_ENV',process.env.NODE_ENV);// undefined
1.6.2.2 命令行配置2
同配置1
"scripts": {
  "build": "webpack --mode=production",
  "start": "webpack --mode=development serve"
},
1.6.2.3 命令行配置
无法在模块内通过process.env.NODE_ENV访问
可以通过webpack 配置文件中中通过函数获取当前环境变量
"scripts": {
   "dev": "webpack serve --env=development",
   "build": "webpack --env=production",
}
index.js

 console.log(process.env.NODE_ENV);// undefined
webpack.config.js

console.log('NODE_ENV',process.env.NODE_ENV);// undefined
module.exports = (env,argv) => {
  console.log('env',env);// development | production
};
1.6.2.4 mode配置
和命令行配置2一样
module.exports = {
mode: 'development'
}
1.6.2.5 DefinePlugin
设置全局变量(不是window),所有模块都能读取到该变量的值
可以在任意模块内通过 process.env.NODE_ENV 获取当前的环境变量
但无法在node环境(webpack 配置文件中)下获取当前的环境变量
plugins:[
   new webpack.DefinePlugin({
      'process.env.NODE_ENV':JSON.stringify(process.env.NODE_ENV)
   })
]   
index.js

console.log(NODE_ENV);//  production
webpack.config.js

console.log('process.env.NODE_ENV',process.env.NODE_ENV);// undefined
console.log('NODE_ENV',NODE_ENV);// error ！！！
1.6.2.6 cross-env
只能设置node环境下的变量NODE_ENV
package.json

"scripts": {
  "build": "cross-env NODE_ENV=development webpack"
}
webpack.config.js

console.log('process.env.NODE_ENV',process.env.NODE_ENV);// development
## 2 开发服务器
2.1 安装服务器
npm install webpack-dev-server --save-dev
2.2 webpack.config.js
类别	配置名称	描述
output	path	指定输出到硬盘上的目录
output	publicPath	表示的是打包生成的index.html文件里面引用资源的前缀
devServer	publicPath	表示的是打包生成的静态文件所在的位置(若是devServer里面的publicPath没有设置，则会认为是output里面设置的publicPath的值)
devServer	static	用于配置提供额外静态文件内容的目录
2.3 webpack.config.js
module.exports = {
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 8080,
    open: true
  },
}
2.4 package.json
  "scripts": {
    "build": "webpack",
+   "start": "webpack serve"
  }
## 3. 支持CSS
css-loader用来翻译处理@import和url()
style-loader可以把CSS插入DOM中
3.1 安装模块
cnpm i style-loader css-loader -D
3.2 webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool:false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
     { test: /\.css$/, use: ['style-loader','css-loader'] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
3.3 src\bg.css
src\bg.css

body{
    background-color: green;
}
3.4 src\index.css
src\index.css

@import "./bg.css";
body{
    color:red;
}
3.5 src\index.js
src\index.js

+import './index.css';
## 4. 支持less和sass
4.1 安装
npm i less less-loader -D
npm i node-sass sass-loader -D
4.2 webpack.config.js
webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
+     { test: /\.less$/, use: ['style-loader','css-loader', 'less-loader'] },
+     { test: /\.scss$/, use: ['style-loader','css-loader', 'sass-loader'] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
};
4.3 src\index.html
src\index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack5</title>
</head>
<body>
+  <div id="less-container">less-container</div>
+  <div id="sass-container">sass-container</div>
</body>
</html>
```
4.4 src\index.js
src\index.js

import './index.css';
+import './less.less';
+import './sass.scss';
4.5 src\less.less
src\less.less

@color:blue;
#less-container{
    color:@color;
}
4.6 src\sass.scss
src\sass.scss

$color:orange;
#sass-container{
    color:$color;
}
4.7 options
url Enable/disable url() resolving.
import Allows to enables/disables @import at-rules handling
modules Allows to enable/disable CSS Modules or ICSS and setup configuration
sourceMap By default generation of source maps depends on the devtool option
importLoaders Allows to enables/disables or setups number of loaders applied before CSS loader for @import at-rules
esModule By default, css-loader generates JS modules that use the ES modules syntax. There are some cases in which using ES modules is beneficial
```js
{
  loader:'css-loader',
  options:{
    url:false,
    import:false,
    modules:true,
    sourceMap:true,
    importLoaders:true,
    esModule:true
  }
}
```
### 4.8 @和~
- @是webpack设置的路径别名
- Starting with version 4.0.0, absolute paths are parsed based on the server root
- To import assets from a node_modules path (include resolve.modules) and for alias, prefix it with a ~
```js
{
  resolve:{
  alias:{
    '@':path.resolve('src')
  }
 }
}
```
```css
.bg{
    width:100px;
    height:100px;
    background-image: url(images/kf.jpg);
    background-image: url(@/images/kf.jpg);
     background-image: url(~modue/images/kf.jpg);
}
```
## 5. CSS兼容性
为了浏览器的兼容性，有时候我们必须加入-webkit,-ms,-o,-moz这些前缀
- Trident内核：主要代表为IE浏览器, 前缀为-ms
- Gecko内核：主要代表为Firefox, 前缀为-moz
- Presto内核：主要代表为Opera, 前缀为-o
- Webkit内核：产要代表为Chrome和Safari, 前缀为-webkit
- 伪元素::placeholder可以选择一个表单元素的占位文本，它允许开发者和设计师自定义占位文本的样式。
### 5.1 安装
- https://caniuse.com/
- postcss-loader可以使用PostCSS处理CSS
- postcss-preset-env把现代的CSS转换成大多数浏览器能理解的
- PostCSS Preset Env已经包含了autoprefixer和browsers选项
```sh
npm i postcss-loader postcss-preset-env -D
```
### 5.2 postcss.config.js
postcss.config.js
```js
let postcssPresetEnv = require('postcss-preset-env');
module.exports={
    plugins:[postcssPresetEnv({
        browsers: 'last 5 version'
    })]
}
```
### 5.3 webpack.config.js
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
+     { test: /\.css$/, use: ['style-loader', 'css-loader','postcss-loader'] },
+     { test: /\.less$/, use: ['style-loader','css-loader','postcss-loader','less-loader'] },
+     { test: /\.scss$/, use: ['style-loader','css-loader','postcss-loader','sass-loader'] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
};
```
### 5.4 src\index.css
src\index.css
```css
@import "./bg.css";
body{
    color:red;
}
+#root{
+  width:100px;
+  height:50px;
+  transform: rotate(45deg);
+}
```
### 5.5 src\index.html
src\index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack5</title>
</head>
<body>
  <div id="less-container">less-container</div>
  <div id="sass-container">sass-container</div>
+ <div id="root"></div>
</body>
</html>
```
5.6 package.json
- browserslist
- browserslist-example
- .browserslistrc
```json
{
+  "browserslist": {
+    "development": [
+      "last 1 chrome version",
+      "last 1 firefox version",
+      "last 1 safari version"
+    ],
+    "production": [
+      ">0.2%"
+    ]
+  }
+}
```
## 6 资源模块
- 资源模块是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader
- raw-loader => asset/source 导出资源的源代码
- file-loader => asset/resource 发送一个单独的文件并导出 URL
- url-loader => asset/inline 导出一个资源的 data URI
- asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现
- Rule.type
- asset-modules
### 6.1 webpack.config.js
```js
module.exports = {
    module:{
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                "@babel/preset-react"
                            ]
                        },

                    }
                ],
                exclude:/node_modules/
            },
+           {
+               test: /\.png$/,
+               type: 'asset/resource'
+           },
+           {
+               test: /\.ico$/,
+               type: 'asset/inline'
+           },
+           {
+               test: /\.txt$/,
+               type: 'asset/source'
+           },
+           {
+               test: /\.jpg$/,
+               type: 'asset',
+               parser: {
+                   dataUrlCondition: {
+                     maxSize: 4 * 1024 // 4kb
+                   }
+               }
+           }
        ]
    },
  experiments: {
    asset: true
  },
};
```
### 6.2 src\index.js
src\index.js
```js
+ import png from './assets/logo.png';
+ import ico from './assets/logo.ico';
+ import jpg from './assets/logo.jpg';
+ import txt from './assets/logo.txt';
+ console.log(png,ico,jpg,txt);
```
## 7 JS兼容性处理
Babel其实是一个编译JavaScript的平台,可以把ES6/ES7,React的JSX转义为ES5
### 7.1 @babel/preset-env
Babel默认只转换新的最新ES语法,比如箭头函数
### 7.1.1 安装依赖
- babel-loader使用Babel和webpack转译JavaScript文件
- @babel/@babel/coreBabel编译的核心包
- babel-preset-env
- @babel/@babel/preset-reactReact插件的Babel预设
- @babel/plugin-proposal-decorators把类和对象装饰器编译成ES5
- @babel/plugin-proposal-class-properties转换静态类属性以及使用属性初始值化语法声明的属性
```sh
cnpm i babel-loader @babel/core @babel/preset-env @babel/preset-react  -D
cnpm i @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties @babel/plugin-proposal-private-property-in-object  @babel/- plugin-proposal-private-methods -D
```
### 7.1.2 webpack.config.js
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
+      {
+        test: /\.jsx?$/,
+        use: {
+          loader: 'babel-loader',
+          options: {
+            presets: ["@babel/preset-env", '@babel/preset-react'],
+            plugins: [
+              ["@babel/plugin-proposal-decorators", { legacy: true }],
+              ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
+              ["@babel/plugin-proposal-private-methods", { "loose": true }],
+              ["@babel/plugin-proposal-class-properties", { loose: true }],
+            ],
+          },
+        },
+      },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.less$/, use: ['style-loader', 'css-loader','postcss-loader', 'less-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'postcss-loader','sass-loader'] },
      {
        test: /\.(jpg|png|gif|bmp|svg)$/,
        type:'asset/resource',
        generator:{
          filename:'images/[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
};
```
### 7.1.3 src\index.js
src\index.js
```js
+function readonly(target,key,descriptor) {
+    descriptor.writable=false;
+}
+
+class Person{
+    @readonly PI=3.14;
+}
+let p1=new Person();
+p1.PI=3.15;
+console.log(p1)
```
### 7.1.4 jsconfig.json
jsconfig
jsconfig.json
```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```
## 8. ESLint代码校验
### 8.1 安装
- eslint
- eslint-loader
- configuring
- babel-eslint
- Rules
- ESlint 语法检测配置说明
```cnpm
cnpm install eslint eslint-loader babel-eslint --D
```
8.2 webpack.config.js
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
+      {
+        test: /\.jsx?$/,
+        loader: 'eslint-loader',
+        enforce: 'pre',
+        options: { fix: true },
+        exclude: /node_modules/,
+      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": ["@babel/preset-env"],
            "plugins": [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
              ["@babel/plugin-proposal-private-methods", { "loose": true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
            ]
          }
        },
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.less$/, use: ['style-loader', 'css-loader','postcss-loader', 'less-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'postcss-loader','sass-loader'] },
      {
        test: /\.(jpg|png|bmp|gif|svg)$/, use: [{
          loader: 'url-loader', options: {
            limit: 10
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
};
```
### 8.3 src\index.html
src\index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack5</title>
</head>
<body>
+  <div id="root"></div>
</body>
</html>
```
### 8.4 src\index.js
src\index.js
```js
+import React from "react";
+import ReactDOM from "react-dom";
+ReactDOM.render("hello",document.getElementById("root"));
+
+function readonly(target,key,descriptor) {
+    descriptor.writable=false;
+}
+
+class Person{
+    @readonly PI=3.14;
+}
+let p1=new Person();
+p1.PI=3.15;
```
### 8.5 .eslintrc.js
.eslintrc.js

module.exports = {
    root: true,
    parser:"babel-eslint",
    //指定解析器选项
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2015
    },
    //指定脚本的运行环境
    env: {
        browser: true,
    },
    // 启用的规则及其各自的错误级别
    rules: {
        "indent": "off",//缩进风格
        "quotes":  "off",//引号类型 
        "no-console": "error",//禁止使用console
    }
}
8.6 airbnb
eslint-config-airbnb
cnpm i eslint-config-airbnb eslint-loader eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks and eslint-plugin-jsx-a11y -D
eslintrc.js

module.exports = {
    "parser":"babel-eslint",
    "extends":"airbnb",
    "rules":{
        "semi":"error",
        "no-console":"off",
        "linebreak-style":"off",
        "eol-last":"off"
        //"indent":["error",2]
    },
    "env":{
        "browser":true,
        "node":true
    }
}
8.7 自动修复
安装vscode的eslint插件
配置自动修复参数
.vscode\settings.json

{
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
  }
9. 服务器代理
如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。

9.1 不修改路径
请求到 /api/users 现在会被代理到请求 http://localhost:3000/api/users。
devServer: {
  proxy: {
    "/api": 'http://localhost:3000'
  }
}
9.2 修改路径
devServer: {
  proxy: {
      "/api": {
       target: 'http://localhost:3000',
       pathRewrite:{"^/api":""}        
      }            
  }
}
9.3 onBeforeSetupMiddleware
onBeforeSetupMiddleware 在 webpack-dev-server 静态资源中间件处理之前，可以用于拦截部分请求返回特定内容，或者实现简单的数据 mock。
devServer: {
onBeforeSetupMiddleware(devServer){// express()
    devServer.app.get('/api/users', (req, res) => {
      res.json([{ id: 1 }, { id: 2 }]);
    });
}
}
9.4 webpack-dev-middleware
webpack-dev-middleware就是在 Express 中提供 webpack-dev-server 静态服务能力的一个中间件

npm install webpack-dev-middleware --save-dev
const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config');
webpackOptions.mode = 'development';
const compiler = webpack(webpackOptions);
app.use(webpackDevMiddleware(compiler, {}));
app.listen(3000);
webpack-dev-server 的好处是相对简单，直接安装依赖后执行命令即可
而使用webpack-dev-middleware的好处是可以在既有的 Express 代码基础上快速添加 webpack-dev-server 的功能，同时利用 Express 来根据需要添加更多的功能，如 mock 服务、代理 API 请求等