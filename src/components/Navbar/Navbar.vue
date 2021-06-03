<template>
  <nav :class="classes" class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <slot></slot>

      <div class="collapse navbar-collapse justify-content-end" :id="id">
        <ul class="navbar-nav">
          <slot name="navbar-menu"></slot>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  name: "navbar",
  props: {
    id: String,
    showNavbar: Boolean,
    transparent: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      default: "absolute",
    },
    type: {
      type: String,
      default: "white",
      validator(value) {
        return [
          "white",
          "default",
          "primary",
          "danger",
          "success",
          "warning",
          "info",
        ].includes(value);
      },
    },
  },
  computed: {
    classes() {
      let color = `bg-${this.type}`;
      let navPosition = `navbar-${this.position}`;
      return [
        { "navbar-transparent": !this.showNavbar && this.transparent },
        { [color]: this.showNavbar || !this.transparent },
        navPosition,
      ];
    },
  },
};
</script>
<style></style>
