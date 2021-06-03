<template>
  <div class="user user__menu">
    <!-- <div class="photo">
      <img :src="image" alt="avatar" />
    </div> -->
    <div class="info">
      <a
        class="py-0 text-center"
        role="button"
        aria-controls="userMenu"
        aria-expanded="false"
      >
        <user-address></user-address>
      </a>
      <!-- <div class="collapse" id="userMenu">
        <ul class="nav user-menu__nav">
          <slot>
            <li>
              <a href="#vue">
                <span class="sidebar-mini-icon">MP</span>
                <span class="sidebar-normal">My Profile</span>
              </a>
            </li>
            <li>
              <a href="#vue">
                <span class="sidebar-mini-icon">EP</span>
                <span class="sidebar-normal">Edit Profile</span>
              </a>
            </li>
            <li>
              <a href="#vue">
                <span class="sidebar-mini-icon">S</span>
                <span class="sidebar-normal">Settings</span>
              </a>
            </li>
          </slot>
        </ul>
      </div> -->
    </div>
  </div>
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
