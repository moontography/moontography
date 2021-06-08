<template>
  <navbar :show-navbar="showNavbar" id="navigation">
    <div class="navbar-wrapper">
      <div class="navbar-toggle" :class="{ toggled: $sidebar.showSidebar }">
        <navbar-toggle-button @click="toggleSidebar"> </navbar-toggle-button>
      </div>
      <router-link class="navbar-brand" to="/">
        {{ $route.name }}
      </router-link>
    </div>
    <button
      @click="toggleNavbar"
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navigation"
      aria-controls="navigation-index"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-bar navbar-kebab"></span>
      <span class="navbar-toggler-bar navbar-kebab"></span>
      <span class="navbar-toggler-bar navbar-kebab"></span>
    </button>

    <template v-slot:navbar-menu>
      <!-- <form>
        <div class="input-group no-border">
          <fg-input
            placeholder="Search..."
            addon-right-icon="now-ui-icons ui-1_zoom-bold"
          >
          </fg-input>
        </div>
      </form> -->
      <li class="d-flex align-items-center">
        <a class="mr-2" href="https://github.com/moontography" target="_blank">
          <i class="fa fa-2x fa-github"></i>
        </a>
        <span>
          1 MTGY = ${{ mtgyPriceUsd }}
          USD
        </span>
      </li>
      <!-- <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#pablo">
            <i class="now-ui-icons media-2_sound-wave"></i>
            <p>
              <span class="d-lg-none d-md-block">Stats</span>
            </p>
          </a>
        </li>
        <drop-down
          tag="li"
          position="right"
          class="nav-item"
          icon="now-ui-icons location_world"
        >
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </drop-down>

        <li class="nav-item">
          <a class="nav-link" href="#pablo">
            <i class="now-ui-icons users_single-02"></i>
            <p>
              <span class="d-lg-none d-md-block">Account</span>
            </p>
          </a>
        </li>
      </ul> -->
    </template>
  </navbar>
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
<style></style>