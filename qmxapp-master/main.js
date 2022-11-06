import App from './App'
import uView from "uview-ui";
import topNavbar from '@/components/top-navbar/top-navbar'
import * as api from './utils/api.js'
import config from './utils/config.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import AES from 'common/aes.js'
import "js_sdk/ican-H5Api/ican-H5Api.js"
import {VueJsonp} from 'vue-jsonp'
Vue.use(VueJsonp);

Vue.component('topNavbar',topNavbar);
Vue.use(VueAxios, axios)
Vue.use(uView);
Vue.prototype.$api = api
Vue.prototype.AES = AES.AES
Vue.use(config)
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif