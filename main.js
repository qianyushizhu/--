import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import fifter from './utils/filters.js'
import Dialog from './utils/dialogUtils.js'
import share from '@/common/share.js'
Vue.mixin(share)
Vue.config.productionTip = false
Vue.use(uView)
App.mpType = 'app'
// Vue.prototype.$imgUrl='http://oss.juxinban.cn/'
Vue.prototype.$imgUrl='https://file.innopinenut.com/'
Vue.prototype.$imgUrl2='https://file.innopinenut.com/'
Vue.prototype.$fifter= fifter
Vue.prototype.$Dialog= Dialog
Object.keys(fifter).forEach(key=>Vue.filter(key,fifter[key]))
const app = new Vue({
    ...App
})
app.$mount()
