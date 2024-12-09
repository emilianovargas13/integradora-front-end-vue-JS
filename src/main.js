import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";

// Bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Configuración de Font Awesome
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
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
