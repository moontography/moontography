<template lang="pug">
.sidebar(:data-color='backgroundColor')
  .logo
    a.simple-text.logo-mini(href='/')
      .logo-image
        img(:src='logo')
    a.simple-text.logo-normal(href='/')
      | {{ title }}
    .navbar-minimize
      button#minimizeSidebar.btn.btn-outline-white.btn-icon.btn-round(@click='minimizeSidebar')
        i.now-ui-icons.text_align-center.visible-on-sidebar-regular
        i.now-ui-icons.design_bullet-list-67.visible-on-sidebar-mini
  .sidebar-wrapper
    ul.mt-2.nav
      slot(name='links')
        sidebar-item(v-for='(link, index) in sidebarLinks' :key='link.name + index' :link='link')
          sidebar-item(v-for='(subLink, index) in link.children' :key='subLink.name + index' :link='subLink')
  .sidebar-footer.d-block.d-lg-none
    sidebar-footer

</template>
<script>
export default {
  name: "sidebar",
  props: {
    title: {
      type: String,
      default: "Moontography",
    },
    backgroundColor: {
      type: String,
      default: "black",
      validator: (value) => {
        let acceptedValues = [
          "",
          "primary",
          "blue",
          "azure",
          "green",
          "orange",
          "red",
          "purple",
          "black",
        ];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    logo: {
      type: String,
      default: "img/logo-white-nn.png",
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  methods: {
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    },
  },
  beforeUnmount() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  },
};
</script>
<style>
@media (min-width: 992px) {
  .navbar-search-form-mobile,
  .nav-mobile-menu {
    display: none;
  }
}
</style>
