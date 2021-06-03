import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "../views/dashboard/layout/DashboardLayout.vue";

// Page Headers
// import DashboardHeader from "../views/dashboard/dashboard/DashboardHeader.vue";
import DefaultHeader from "../views/dashboard/headers/DefaultHeader";
import TrustedTimestampingHeader from "../views/dashboard/headers/TrustedTimestampingHeader";

// Dashboard pages
import TrustedTimestamping from "../views/dashboard/dashboard/TrustedTimestamping.vue";

const routes = [
  {
    path: "/",
    redirect: "/timestamping",
    name: "Home",
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/timestamping",
    name: "Blockchain Trusted Timestamping",
    children: [
      {
        path: "timestamping",
        name: "Blockchain Trusted Timestamping",
        // components: { default: Dashboard, header: DashboardHeader },
        components: {
          default: TrustedTimestamping,
          header: TrustedTimestampingHeader,
        },
      },
      {
        path: "faas",
        name: "Farming-as-a-Service",
        components: { default: TrustedTimestamping, header: DefaultHeader },
      },
      {
        path: "bts",
        name: "Bulk Token Sender",
        components: { default: TrustedTimestamping, header: DefaultHeader },
      },
      {
        path: "dtax",
        name: "Decentralized Tax Reporting",
        components: { default: TrustedTimestamping, header: DefaultHeader },
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/timestamping" },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: "active",
  routes,
});

export default router;
