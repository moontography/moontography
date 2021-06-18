// =========================================================
// * Vue Now UI Dashboard PRO - v2.0.0
// =========================================================
//
// * Product Page: http://www.creative-tim.com/product/vue-now-ui-dashboard-pro
// * Copyright 2019 Creative Tim (http://www.creative-tim.com)
//
// * Designed by www.invisionapp.com Coded by www.creative-tim.com
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import { createApp } from "vue";
import Moontography from "./Moontography.vue";
import router from "./router";
import store from "./vuex/store";

import Toast, { useToast, PluginOptions, POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

import DashboardPlugin from "./dashboard-plugin";

const options: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 4000,
  containerClassName: "ct-notification",
};

const appInstance = createApp(Moontography);
appInstance.use(router);
appInstance.use(store);
appInstance.use(Toast, options);
appInstance.use(DashboardPlugin);
appInstance.mount("#moontography");
appInstance.config.globalProperties.$toast = useToast();
