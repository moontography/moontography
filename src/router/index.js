import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "../views/layout/DashboardLayout.vue";

// Page Headers
// import DashboardHeader from "../views/DashboardHeader.vue";
// import DefaultHeader from "../views/headers/DefaultHeader";
import TrustedTimestampingHeader from "../views/headers/TrustedTimestampingHeader";
import FaasHeader from "../views/headers/FaasHeader";
import BulkTokenSenderHeader from "../views/headers/BulkTokenSenderHeader";
import DtaxHeader from "../views/headers/DtaxHeader";

// Dashboard pages
import FaasLayout from "../views/layout/FaasLayout.vue";
import FaasOwner from "../views/dashboards/Faas/FaasOwner.vue";
import FaasStaker from "../views/dashboards/Faas/FaasStaker.vue";
import TrustedTimestamping from "../views/dashboards/TrustedTimestamping.vue";
import ComingSoon from "../views/components/ComingSoon.vue";

const routes = [
  {
    path: "",
    redirect: { name: "home" },
  },
  {
    path: "/",
    name: "home",
    redirect: { name: "timestamping" },
    component: DashboardLayout,
    children: [
      {
        path: "timestamping",
        name: "timestamping",
        components: {
          default: TrustedTimestamping,
          header: TrustedTimestampingHeader,
        },
      },
      {
        path: "faas",
        name: "faas",
        components: { default: FaasLayout, header: FaasHeader },
        children: [
          {
            path: "owner",
            name: "faasOwner",
            component: FaasOwner,
          },
          {
            path: "owner/:tokenAddress",
            name: "faasOwnerToken",
            component: FaasOwner,
            props: true,
          },
          {
            path: ":tokenAddress",
            name: "faasStakerToken",
            component: FaasStaker,
            props: true,
          },
          {
            path: "",
            name: "faasStaker",
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
        path: "dtax",
        name: "Decentralized Tax Reporting",
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
