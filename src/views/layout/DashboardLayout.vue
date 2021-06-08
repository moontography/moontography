<template lang="pug">
div.wrapper(:class="{ 'nav-open': $sidebar.showSidebar }")
  side-bar(:background-color="'primary'")
    template(v-slot:links)
      user-menu
      sidebar-item(
        :link=`{
          name: 'Trusted Timestamping',
          icon: 'now-ui-icons design_app',
          path: '/timestamping',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Farming as a Service',
          icon: 'now-ui-icons sport_trophy',
          path: '/faas',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Bulk Token Sender',
          icon: 'now-ui-icons objects_spaceship',
          path: '/bts',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Decentralized Tax Reporting',
          icon: 'now-ui-icons business_money-coins',
          path: '/dtax',
        }`
      )

      //- sidebar-item(
      //-   :link="{ name: 'Pages', icon: 'now-ui-icons design_image' }"
      //- )
      //-   sidebar-item(
      //-     :link="{ name: 'Pricing', path: '/pricing' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Timeline', path: '/pages/timeline' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Login', path: '/login' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Register', path: '/register' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Lock Screen', path: '/lock' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'User Profile', path: '/pages/user' }"
      //-   )
      //- sidebar-item(
      //-   :link="{ name: 'Components', icon: 'now-ui-icons education_atom' }"
      //- )
      //-   sidebar-item(
      //-     :link="{ name: 'Buttons', path: '/components/buttons' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Grid System', path: '/components/grid-system' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Panels', path: '/components/panels' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Sweet Alert', path: '/components/sweet-alert' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Notifications', path: '/components/notifications' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Icons', path: '/components/icons' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Typography', path: '/components/typography' }"
      //-   )
      //- sidebar-item(
      //-   :link="{ name: 'Forms', icon: 'now-ui-icons files_single-copy-04' }"
      //- )
      //-   sidebar-item(
      //-     :link="{ name: 'Regular Forms', path: '/forms/regular' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Extended Forms', path: '/forms/extended' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Validation Forms', path: '/forms/validation' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Wizard', path: '/forms/wizard' }"
      //-   )

      //- sidebar-item(
      //-   :link="{ name: 'Tables', icon: 'now-ui-icons design_bullet-list-67' }"
      //- )
      //-   sidebar-item(
      //-     :link="{ name: 'Regular Tables', path: '/table-list/regular' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Extended Tables', path: '/table-list/extended' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Paginated Tables', path: '/table-list/paginated' }"
      //-   )
      //- sidebar-item(
      //-   :link="{ name: 'Maps', icon: 'now-ui-icons location_pin' }"
      //- )
      //-   sidebar-item(
      //-     :link="{ name: 'Google Maps', path: '/maps/google' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Full Screen Maps', path: '/maps/full-screen' }"
      //-   )
      //-   sidebar-item(
      //-     :link="{ name: 'Vector Maps', path: '/maps/vector-map' }"
      //-   )
      //- sidebar-item(
      //-   :link=`{
      //-     name: 'Widgets',
      //-     icon: 'now-ui-icons objects_diamond',
      //-     path: '/widgets',
      //-   }`
      //- )
      //- sidebar-item(
      //-   :link=`{
      //-     name: 'Charts',
      //-     icon: 'now-ui-icons business_chart-pie-36',
      //-     path: '/charts',
      //-   }`
      //- )
      //- sidebar-item(
      //-   :link=`{
      //-     name: 'Calendar',
      //-     icon: 'now-ui-icons media-1_album',
      //-     path: '/calendar',
      //-   }`
      //- )

  div.main-panel
    top-navbar
    router-view(name="header")

    div(
      :class="{ content: !$route.meta.hideContent }"
      @click="toggleSidebar")
        //- div.my-4.alert.alert-danger(v-if="globalError")
        //-   span {{ globalError.message }}
        router-view

    content-footer(v-if="!$route.meta.hideFooter")
</template>
<script>
/* eslint-disable no-new */
// import PerfectScrollbar from "perfect-scrollbar";
// import "perfect-scrollbar/css/perfect-scrollbar.css";

// function hasElement(className) {
//   return document.getElementsByClassName(className).length > 0;
// }
//
// function initScrollbar(className) {
//   if (hasElement(className)) {
//     new PerfectScrollbar(`.${className}`);
//   } else {
//     // try to init it later in case this component is loaded async
//     setTimeout(() => {
//       initScrollbar(className);
//     }, 100);
//   }
// }

import { mapState } from "vuex";
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import UserMenu from "./extra/UserMenu.vue";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    UserMenu,
  },
  computed: mapState({
    globalError: (state) => state.globalError,
  }),
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
  mounted() {
    // let docClasses = document.body.classList;
    // let isWindows = navigator.platform.startsWith("Win");
    // if (isWindows) {
    //   // if we are on windows OS we activate the perfectScrollbar function
    //   initScrollbar("sidebar");
    //   initScrollbar("sidebar-wrapper");
    //
    //   docClasses.add("perfect-scrollbar-on");
    // } else {
    //   docClasses.add("perfect-scrollbar-off");
    // }
  },
};
</script>
<style lang="scss"></style>
