import Vue from 'vue';
import App from './App.vue';
import store from './store';
import '@/assets/style/main.scss';
import { rwdMethods } from '@/mixins/masterBuilder.js';

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
  mixins: [rwdMethods]
}).$mount('#app');

// rec.udn.com追蹤碼
window.onload = () => {
  document.getElementsByTagName('iframe')[0].style.top = 0;
};

// Taiwan can help
console.log("%c#TaiwanCanHelp", "font-size:36px;color:#FFAAD5	;font-weight:bold;");