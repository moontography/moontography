<template lang="pug">
navbar#navigation(:show-navbar="showNavbar")
  div.navbar-wrapper
    div.navbar-toggle(:class="{ toggled: $sidebar.showSidebar }")
      navbar-toggle-button(@click="toggleSidebar")
    router-link.navbar-brand(to="/") {{ $route.name }}
  
  //- button(
  //-   @click="toggleNavbar"
  //-   class="navbar-toggler"
  //-   type="button"
  //-   data-toggle="collapse"
  //-   data-target="#navigation"
  //-   aria-controls="navigation-index"
  //-   aria-expanded="false"
  //-   aria-label="Toggle navigation")
  //-   span.navbar-toggler-bar.navbar-kebab
  //-   span.navbar-toggler-bar.navbar-kebab
  //-   span.navbar-toggler-bar.navbar-kebab

  template(v-slot:navbar-menu)
  
    //- form
    //-   div.input-group.no-border
    //-     fg-input(
    //-       placeholder="Search..."
    //-       addon-right-icon="now-ui-icons ui-1_zoom-bold"
    //-     )
  
    ul.navbar-nav
      li.nav-item
        a.nav-link(
          title="Website"
          href="https://moontography.com"
          target="_blank"
          rel="noopener noreferrer")
            i.fa.fa-2x.fa-globe
      li.nav-item
        a.nav-link(
          title="Telegram"
          href="https://t.me/moontographyproject"
          target="_blank"
          rel="noopener noreferrer")
            i.fa.fa-2x.fa-telegram
      li.nav-item
        a.nav-link(
          title="Blog"
          href="https://blog.moontography.com"
          target="_blank"
          rel="noopener noreferrer")
            i.fa.fa-2x.fa-medium
      li.nav-item
        a.nav-link(
          title="GitHub"
          href="https://github.com/moontography"
          target="_blank"
          rel="noopener noreferrer")
            i.fa.fa-2x.fa-github
      li.nav-item
        a.nav-link(
          title="PancakeSwap"
          href="https://exchange.pancakeswap.finance/#/swap?inputCurrency=0x025c9f1146d4d94F8F369B9d98104300A3c8ca23"
          target="_blank"
          rel="noopener noreferrer")
            img.gray(
              style="max-height: 20px"
              src="img/pancakeswap-logo.png")
      li.nav-item
        a.nav-link(
          title="DEXTools"
          href="https://www.dextools.io/app/pancakeswap/pair-explorer/0xaabafd64feb2ec235b209a95d4dc9b08e225379c"
          target="_blank"
          rel="noopener noreferrer")
            img.gray(
              style="max-height: 20px"
              src="img/dextools.png")
      li.nav-item
        a.nav-link.no-hover
          | 1 MTGY = ${{ mtgyPriceUsd }} USD

    //-   li.nav-item
    //-     a.nav-link(href="#pablo")
    //-       i.now-ui-icons.media-2_sound-wave
    //-       p
    //-         span.d-lg-none.d-md-block Stats
      
    //-   drop-down(
    //-     tag="li"
    //-     position="right"
    //-     class="nav-item"
    //-     icon="now-ui-icons location_world"
    //-   )
    //-     a.dropdown-item(href="#") Action
    //-     a.dropdown-item(href="#") Action
    //-     a.dropdown-item(href="#") Action

    //-   li.nav-item
    //-     a.nav-link(href="#pablo")
    //-       i.now-ui-icons.users_single-02
    //-       p
    //-         span.d-lg-none.d-md-block Stats
      
</template>
<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import { Navbar, NavbarToggleButton } from "@/components";

export default {
  components: {
    Navbar,
    NavbarToggleButton,
  },
  computed: {
    ...mapState({
      mtgyPriceUsd: (state) => new BigNumber(state.mtgyPriceUsd).toFixed(6),
    }),

    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
  },
  data() {
    return {
      activeNotifications: false,
      showNavbar: false,
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    toggleNavbar() {
      this.showNavbar = !this.showNavbar;
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
  },
};
</script>
<style lang="scss">
a {
  &.nav-link.no-hover:hover {
    background: inherit !important;
  }
}

img.gray {
  filter: grayscale(100%);
}
</style>
