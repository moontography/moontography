<template lang="pug">
div.user.user_menu
  div.photo.mt-2
    i.d-flex.justify-content-center.now-ui-icons.business_briefcase-24
  div.info.text-center
    a.py-0(
      role="button"
      aria-controls="userMenu"
      aria-expanded="false")
      user-address
</template>
<script>
export default {
  name: "user-menu",
  props: {
    image: {
      type: String,
      default: "img/default-avatar.png",
    },
  },
};
</script>
<style>
.user__menu ul.user-menu__nav {
  margin-top: 0;
  padding-top: 20px;
}
</style>
