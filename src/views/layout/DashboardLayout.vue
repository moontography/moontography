<template lang="pug">
div.wrapper(:class="{ 'nav-open': $sidebar.showSidebar }")
  side-bar(:background-color="'primary'")
    template(v-slot:links)
      user-menu
      sidebar-item(
        :link=`{
          name: 'Dashboard',
          icon: 'now-ui-icons education_atom',
          path: '/dashboard',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Farming',
          icon: 'now-ui-icons sport_trophy',
          path: '/faas',
        }`
      )
      //- sidebar-item(
      //-   :link=`{
      //-     name: 'Alpha as a Service',
      //-     icon: 'now-ui-icons arrows-1_refresh-69',
      //-     path: '/alpha',
      //-   }`
      //- )
      sidebar-item(
        :link=`{
          name: 'Atomic Swap/Bridging',
          icon: 'now-ui-icons arrows-1_refresh-69',
          path: '/asaas',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Airdropper',
          icon: 'now-ui-icons objects_spaceship',
          path: '/airdropper',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Buybot',
          icon: 'now-ui-icons gestures_tap-01',
          path: '/buybot',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Raffler/Lottery',
          icon: 'now-ui-icons business_money-coins',
          path: '/raffler',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Trusted Timestamping',
          icon: 'now-ui-icons design_app',
          path: '/timestamping',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Password Manager',
          icon: 'now-ui-icons ui-1_lock-circle-open',
          path: '/passwords',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Polling',
          icon: 'now-ui-icons business_chart-bar-32',
          path: '/paas',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Tax Reporting',
          icon: 'now-ui-icons business_briefcase-24',
          path: '/dtax',
        }`
      )
      sidebar-item(
        :link=`{
          name: 'Thousand Ether Homepage',
          icon: 'now-ui-icons objects_globe',
          path: '/1000ether',
        }`
      )

  div.main-panel
    top-navbar
    router-view(name="header")

    div(
      :class="{ content: !$route.meta.hideContent }"
      @click="toggleSidebar")
        div.d-flex.my-4.alert.alert-danger(v-if="globalError")
          span.mx-auto {{ globalError.message }}
        loading-panel(v-if="isInitLoading")
        router-view(v-else)

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
    isInitLoading: (state) => state.initLoading,
    globalError: (state) => state.globalError,
    isConnected: (_, getters) => getters.isConnected,
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
