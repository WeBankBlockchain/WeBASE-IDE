import ide from './webase-ide.vue' // 导入组件
const webaseIde = {
    install(Vue, options) {
        console.log('sfsk')
        Vue.component(ide.name, ide)
    }
}
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(webaseIde);
}
export default webaseIde // 导出..