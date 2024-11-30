import Vue from "vue";
import Router from "vue-router";
import Login from "../views/auth/Login_view.vue";
import RecoverPasswordP1View from "../views/auth/Recover_password1_view.vue";
import RecoverPasswordP2View from "../views/auth/Recover_password2_view.vue";
import RecoverPasswordP3View from "../views/auth/Recover_password3_view.vue";
import ProfileView from "../views/admin/Profile_view.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/recover-password-step1",
      name: "RecoverPasswordP1",
      component: RecoverPasswordP1View,
    },
    {
      path: "/recover-password-step2",
      name: "RecoverPasswordP2",
      component: RecoverPasswordP2View,
    },
    {
      path: "/recover-password-step3",
      name: "RecoverPasswordP3",
      component: RecoverPasswordP3View,
    },
    {
      path: "/profile_view",
      name: "ProfileView",
      component: ProfileView,
    },






    {
      path: "*", // Ruta para redirigir cualquier URL desconocida
      redirect: "/login",
    },
  ],
});
