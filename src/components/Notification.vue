<template>
  <div
    class="alert alert-with-icon"
    :class="'alert-' + type"
    data-notify="container"
  >
    <button type="button" aria-hidden="true" class="close">
      <i class="now-ui-icons ui-1_simple-remove"></i>
    </button>
    <span data-notify="icon" v-if="icon && !ownIcon" :class="icon"></span>
    <span data-notify="icon" v-else :class="ownIcon"></span>
    <span data-notify="message" v-if="text && !ownText" v-html="text"></span>
    <span data-notify="message" v-else v-html="ownText"></span>
  </div>
</template>
<script>
export default {
  name: "notification",
  props: {
    ownText: String,
    text: String,
    type: String,
    icon: String,
    ownIcon: String,
  },
};
</script>
<style lang="scss"></style>
