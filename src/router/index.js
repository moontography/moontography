import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "../views/layout/DashboardLayout.vue";

// Page Headers
// import DefaultHeader from "../views/headers/DefaultHeader";
import DashboardHeader from "../views/headers/DashboardHeader.vue";
import TrustedTimestampingHeader from "../views/headers/TrustedTimestampingHeader";
import FaasHeader from "../views/headers/FaasHeader";
import BulkTokenSenderHeader from "../views/headers/BulkTokenSenderHeader";
import DtaxHeader from "../views/headers/DtaxHeader";

// Dashboard pages
import Dashboard from "../views/dashboards/dashboard/Dashboard.vue";
import FaasLayout from "../views/layout/FaasLayout.vue";
import FaasOwner from "../views/dashboards/Faas/FaasOwner.vue";
import FaasStaker from "../views/dashboards/Faas/FaasStaker.vue";
import TrustedTimestamping from "../views/dashboards/TrustedTimestamping.vue";
import ComingSoon from "../views/components/ComingSoon.vue";

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
        path: "timestamping",
        name: "Timestamping",
        components: {
          default: TrustedTimestamping,
          header: TrustedTimestampingHeader,
        },
      },
      {
        path: "faas",
        name: "Faas",
        components: { default: FaasLayout, header: FaasHeader },
        children: [
          {
            path: "owner",
            name: "FaasOwner",
            component: FaasOwner,
          },
          {
            path: "owner/:tokenAddress",
            name: "FaasOwnerToken",
            component: FaasOwner,
            props: true,
          },
          {
            path: ":tokenAddress",
            name: "FaasStakerToken",
            component: FaasStaker,
            props: true,
          },
          {
            path: "",
            name: "FaasStaker",
            component: FaasStaker,
          },
        ],
      },
      {
        path: "bts",
        name: "BulkTokenSender",
        components: { default: ComingSoon, header: BulkTokenSenderHeader },
      },
      {
        path: "dtax",
        name: "Dtax",
        components: { default: ComingSoon, header: DtaxHeader },
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
