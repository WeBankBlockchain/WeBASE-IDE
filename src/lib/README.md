#####插件的安装
`npm init webase-ide —save`

> 修改依赖：

   在node_modules中找到依赖包`require-from-string`，修改`index.js`文件第2行

   	var Module = require("module");

   改为

   	var Module = module.constructor;

##### 引入合约编译器

把webase-ide插件里static目录下js文件copy到vue项目static文件里

文件结构

> -src
>
> -static
>
> ​	-js

​	

##### 引入插件

在main.js中引入以下内容：

```javascript
import Vue from 'vue';
import webaseIde from 'webase-ide';
import App from './App.vue';
Vue.use(webaseIde);
new Vue({
  el: '#app',
  render: h => h(App)
});
```

以上代码便完成了 Webase-ide的引入。

##### 基本用法

`<webase-ide :data="data" @complieSuccess="complieSuccess"></webase-ide>`

参数

| 参数   | 说明         | 类型   | 默认 |
| ------ | ------------ | ------ | ---- |
| data   | 合约列表     | Array  | -    |
| height | ide的高度    | Number | 500  |
| type   | 合约编译版本 | Number | 1    |

事件

| 事件名称       | 说明           | 回调参数 |
| -------------- | -------------- | -------- |
| complieSuccess | 编译成功的回调 | Object   |

