import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import VJsonschemaForm from '@koumoul/vuetify-jsonschema-form'
import '@koumoul/vuetify-jsonschema-form/dist/main.css'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
