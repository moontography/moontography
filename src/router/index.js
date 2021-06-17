import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "../views/layout/DashboardLayout.vue";

// Page Headers
import AsaasHeader from "../views/headers/AsaasHeader";
import BulkTokenSenderHeader from "../views/headers/BulkTokenSenderHeader";
import DashboardHeader from "../views/headers/DashboardHeader.vue";
import DefaultHeader from "../views/headers/DefaultHeader";
import DtaxHeader from "../views/headers/DtaxHeader";
import FaasHeader from "../views/headers/FaasHeader";
import PasswordManagerHeader from "../views/headers/PasswordManagerHeader";
import TrustedTimestampingHeader from "../views/headers/TrustedTimestampingHeader";

// Dashboard pages
import ComingSoon from "../views/components/ComingSoon.vue";
import Dashboard from "../views/dashboards/dashboard/Dashboard.vue";
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
        name: "ASAAS",
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
        path: "bts",
        name: "Bulk Token Sender",
        components: { default: ComingSoon, header: BulkTokenSenderHeader },
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
        components: { default: ComingSoon, header: DefaultHeader },
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
