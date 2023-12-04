import Vue from 'vue'
import App from './App.vue'
import './assets/style/style.css'
import './assets/style/skeleton.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
