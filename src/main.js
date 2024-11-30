import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft, faChevronRight, faHome, faChartBar, faUsers, faArchive, faCalendarAlt, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faChevronLeft, faChevronRight, faHome, faChartBar, faUsers, faArchive, faCalendarAlt, faTruck);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router, // Asegúrate de incluir el router aquí
  render: (h) => h(App),
}).$mount("#app");
