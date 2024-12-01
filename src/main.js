import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronLeft,
  faChevronRight,
  faHome,
  faChartBar,
  faUsers,
  faArchive,
  faCalendarAlt,
  faTruck,
  faEdit,
  faTimes,
  faCheck,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

library.add(
  faChevronLeft,
  faChevronRight,
  faHome,
  faChartBar,
  faUsers,
  faArchive,
  faCalendarAlt,
  faTruck,
  faEdit,
  faTimes,
  faCheck,
  faBell
);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
