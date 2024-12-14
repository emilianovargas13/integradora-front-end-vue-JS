import Vue from "vue";
import Router from "vue-router";
import Login from "../views/auth/Login_view.vue";
import RecoverPasswordP1View from "../views/auth/Recover_password1_view.vue";
import RecoverPasswordP2View from "../views/auth/Recover_password2_view.vue";
import RecoverPasswordP3View from "../views/auth/Recover_password3_view.vue";
import ProfileView from "../views/admin/Profile_view.vue";
import Events from "../views/admin/Events.vue";
import ResourcesType from "../views/admin/Resources_type.vue";
import Resources from "../views/admin/Resources.vue";
import Stats from "../views/admin/Stats.vue";
import Suppliers from "../views/admin/Suppliers.vue";
import ViewAdmins from "../views/admin/View_Admins.vue";
import Addresses from "../views/admin/Adress.vue";
import SupplierResources from "@/views/admin/Supplier_resources.vue";
import LandigPage from "../views/auth/Landing_page.vue";


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
      path: "/profile-view",
      name: "ProfileView",
      component: ProfileView,
    },
    {
      path: "/events",
      name: "Events",
      component: Events,
    },
    {
      path: "/resources_type",
      name: "ResourcesType",
      component: ResourcesType,
    },
    {
      path: "/stats",
      name: "Stats",
      component: Stats,
    },
    {
      path: "/suppliers",
      name: "Suppliers",
      component: Suppliers,
    },
    {
      path: "/view-admins",
      name: "ViewAdmins",
      component: ViewAdmins,
    },
    {
      path: "/resources",
      name: "Resources",
      component: Resources,
    },
    {
      path: "/addresses",
      name: "Addresses",
      component: Addresses,
    },
    {

      path: "/supplier-resources",
      name: "SupplierResources",
      component: SupplierResources,

    },
    {
      path: "/landig-page",
      name: "LandingPage",
      component: LandigPage
    },




    {
      path: "*", // Ruta para redirigir cualquier URL desconocida
      redirect: "/landig-page",
    },
  ],
});
