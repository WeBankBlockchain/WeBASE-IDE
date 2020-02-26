import Vue from 'vue'
import App from './App.vue'
import webaseIde from './lib/index.js'
// import vuePayKeyboard from './lib/indexvue-pay-keyboard'
Vue.use(webaseIde)
new Vue({
  el: '#app',
  render: h => h(App)
})
