# ide

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

在node_modules中找到依赖包`require-from-string`，修改`index.js`文件第2行
   
var Module = require("module");

改为

var Module = module.constructor;
# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
