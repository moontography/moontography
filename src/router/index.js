import { createRouter, createWebHashHistory } from "vue-router";

import store from "../vuex/store";

import DashboardLayout from "../views/layout/DashboardLayout.vue";
import GlobalLoader from "../views/layout/GlobalLoader";

// Page Headers
// import DefaultHeader from "../views/headers/DefaultHeader";
import AsaasHeader from "../views/headers/AsaasHeader";
import AirdropperHeader from "../views/headers/AirdropperHeader";
import DashboardHeader from "../views/headers/DashboardHeader.vue";
import DtaxHeader from "../views/headers/DtaxHeader";
import FaasHeader from "../views/headers/FaasHeader";
import PaasHeader from "../views/headers/PaasHeader";
import PasswordManagerHeader from "../views/headers/PasswordManagerHeader";
import TrustedTimestampingHeader from "../views/headers/TrustedTimestampingHeader";

// Dashboard pages
import ComingSoon from "../views/components/ComingSoon.vue";
import Dashboard from "../views/dashboards/dashboard/Dashboard.vue";
import Airdropper from "../views/dashboards/Airdropper/Airdropper.vue";
import FaasLayout from "../views/layout/FaasLayout.vue";
import FaasOwner from "../views/dashboards/Faas/FaasOwner.vue";
import FaasStaker from "../views/dashboards/Faas/FaasStaker.vue";
import PasswordManager from "../views/dashboards/PasswordManager/PasswordManager.vue";
import PasswordManagerLayout from "../views/layout/PasswordManagerLayout.vue";
import SwapsListView from "../views/dashboards/ASaaS/SwapsListView.vue";
import TrustedTimestamping from "../views/dashboards/TrustedTimestamping.vue";
import TrustedTimestampingLayout from "../views/layout/TrustedTimestampingLayout.vue";

const routes = [
  {
    path: "",
    redirect: { name: "Home" },
  },
  {
    path: "/",
    name: "Home",
    redirect: { name: "Dashboard" },
    component: DashboardLayout,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        components: { default: Dashboard, header: DashboardHeader },
      },
      {
        path: "asaas",
        name: "Atomic Swapping",
        components: { default: SwapsListView, header: AsaasHeader },
      },
      {
        path: "timestamping",
        name: "Timestamping",
        components: {
          default: TrustedTimestampingLayout,
          header: TrustedTimestampingHeader,
        },
        children: [
          {
            path: "",
            name: "Timestamping",
            component: TrustedTimestamping,
          },
        ],
      },
      {
        path: "faas",
        name: "Faas",
        components: { default: FaasLayout, header: FaasHeader },
        children: [
          {
            path: "owner",
            name: "Faas Owner",
            component: FaasOwner,
          },
          {
            path: "owner/:tokenAddress",
            name: "Faas Owner Token",
            component: FaasOwner,
            props: true,
          },
          {
            path: ":tokenAddress",
            name: "Faas Staker Token",
            component: FaasStaker,
            props: true,
          },
          {
            path: "",
            name: "Faas Staker",
            component: FaasStaker,
          },
        ],
      },
      {
        path: "airdropper",
        name: "Airdropper",
        components: { default: Airdropper, header: AirdropperHeader },
      },
      {
        path: "passwords",
        name: "Password Manager",
        components: {
          default: PasswordManagerLayout,
          header: PasswordManagerHeader,
        },
        children: [
          {
            path: ":accountId",
            name: "Password",
            component: PasswordManager,
            props: true,
          },
          {
            path: "",
            name: "Password Manager",
            component: PasswordManager,
          },
        ],
      },
      {
        path: "paas",
        name: "Polling as a Service",
        components: { default: ComingSoon, header: PaasHeader },
      },
      {
        path: "dtax",
        name: "Dtax",
        components: { default: ComingSoon, header: DtaxHeader },
      },
      {
        path: "redirecting",
        name: "Redirecting",
        components: { default: GlobalLoader, header: GlobalLoader },
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: "active",
  routes,
});

router.beforeEach((to, from, next) => {
  store.commit("SET_ROUTE", to.fullPath);
  next();
});

export default router;
