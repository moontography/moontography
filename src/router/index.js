import { createRouter, createWebHashHistory } from "vue-router";

import store from "../vuex/store";

import DashboardLayout from "../views/layout/DashboardLayout.vue";
import GlobalLoader from "../views/layout/GlobalLoader";

// Page Headers
// import DefaultHeader from "../views/headers/DefaultHeader";
import AsaasHeader from "../views/headers/AsaasHeader";
import AirdropperHeader from "../views/headers/AirdropperHeader";
import BuybotHeader from "../views/headers/BuybotHeader.vue";
import DashboardHeader from "../views/headers/DashboardHeader.vue";
import DtaxHeader from "../views/headers/DtaxHeader";
import FaasHeader from "../views/headers/FaasHeader";
import KetherHeader from "../views/headers/KetherHeader";
import PaasHeader from "../views/headers/PaasHeader";
import PasswordManagerHeader from "../views/headers/PasswordManagerHeader";
import RafflerHeader from "../views/headers/RafflerHeader";
import TrustedTimestampingHeader from "../views/headers/TrustedTimestampingHeader";

// Dashboard pages
import ComingSoon from "../views/components/ComingSoon.vue";
import Dashboard from "../views/dashboards/dashboard/Dashboard.vue";
import Airdropper from "../views/dashboards/Airdropper/Airdropper.vue";
import Buybot from "../views/dashboards/Buybot/Buybot.vue";
import FaasLayout from "../views/layout/FaasLayout.vue";
import FaasOwner from "../views/dashboards/Faas/FaasOwner.vue";
import FaasStaker from "../views/dashboards/Faas/FaasStaker.vue";
import KetherStats from "../views/dashboards/Kether/KetherStats";
import PasswordManager from "../views/dashboards/PasswordManager/PasswordManager.vue";
import PasswordManagerLayout from "../views/layout/PasswordManagerLayout.vue";
import Raffler from "../views/dashboards/Raffler/Raffler.vue";
import RafflerNew from "../views/dashboards/Raffler/RafflerNew.vue";
import RafflerUnique from "../views/dashboards/Raffler/RafflerUnique.vue";
import RafflerLayout from "../views/layout/RafflerLayout.vue";
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
            name: "Trusted Timestamping",
            component: TrustedTimestamping,
          },
        ],
      },
      {
        path: "faas",
        name: "Farming as a Service",
        components: { default: FaasLayout, header: FaasHeader },
        children: [
          {
            path: "owner",
            name: "Farm Owner",
            component: FaasOwner,
          },
          {
            path: "owner/:tokenAddress",
            name: "Farm Owner Token",
            component: FaasOwner,
            props: true,
          },
          {
            path: ":tokenAddress",
            name: "Farm Staker Token",
            component: FaasStaker,
            props: true,
          },
          {
            path: "",
            name: "Farm Staker",
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
        path: "buybot",
        name: "Buybot",
        components: { default: Buybot, header: BuybotHeader },
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
        path: "raffler",
        name: "Raffler",
        components: {
          default: RafflerLayout,
          header: RafflerHeader,
        },
        children: [
          {
            path: ":raffleId",
            name: "Raffle",
            component: RafflerUnique,
            props: true,
          },
          {
            path: "new",
            name: "New Raffle",
            component: RafflerNew,
          },
          {
            path: "",
            name: "Raffler",
            component: Raffler,
          },
        ],
      },
      {
        path: "paas",
        name: "Polling",
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

      {
        path: "1000ether",
        name: "1000ether",
        components: { default: KetherStats, header: KetherHeader },
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
