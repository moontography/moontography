import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "../views/layout/DashboardLayout.vue";

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
        components: { default: ComingSoon, header: AsaasHeader },
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
        name: "Polling",
        components: { default: ComingSoon, header: PaasHeader },
      },
      {
        path: "dtax",
        name: "Dtax",
        components: { default: ComingSoon, header: DtaxHeader },
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

export default router;
