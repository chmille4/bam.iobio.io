import jQuery from "jquery";
global.jQuery = jQuery;
global.$ = jQuery;

import d3 from "d3";
import Vue from "vue";
import VueRouter from "vue-router";
import VueAnalytics from "vue-analytics";

import App from "./App.vue";
import BamView from "./components/pages/BamView.vue";
import Help from "./components/pages/Help.vue";
import FileRequirements from "./components/pages/FileRequirements.vue";
import Home from "./components/pages/Home.vue";
import License from "./components/pages/License.vue";

import VTooltip from "v-tooltip";
import "../assets/css/v-tooltip.css";
Vue.use(VTooltip);

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/help",
    name: "help",
    component: Help,
  },
  {
    path: "/file-requirements",
    name: "file-requirements",
    component: FileRequirements,
  },
  {
    path: "/license",
    name: "license",
    component: License,
  },
];

const router = new VueRouter({
  mode: "history",
  routes: routes,
});

// Google analytics
Vue.use(VueAnalytics, {
  id: "UA-47481907-2",
  router,
});

new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
});
