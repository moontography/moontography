// // A plugin file where you could register global components used across the app
import GlobalComponents from "./globalComponents";
// // A plugin file where you could register global directives
import GlobalDirectives from "./globalDirectives";
// // Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import SidebarPlugin from "./components/SidebarPlugin";

import "bootstrap/dist/js/bootstrap.min.js";

import "bootstrap/scss/bootstrap.scss";
import "./assets/scss/now-ui-dashboard.scss";
import "./assets/scss/index.scss";

export default {
  install(app) {
    app.use(GlobalComponents);
    app.use(GlobalDirectives);
    app.use(SidebarPlugin);
  },
};
