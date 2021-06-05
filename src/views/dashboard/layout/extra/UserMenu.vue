<template lang="pug">
div.user.user_menu
  li
    a.active.router-link-exact-active.nav-link
      i.now-ui-icons.business_briefcase-24
      p
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
