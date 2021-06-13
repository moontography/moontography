<template lang="pug">
.row
  .col-md-6
    card.p-2
      h3 Your Accounts
      input.form-control(
        placeholder="Search accounts.."
        v-model="accountSearch")

      .card-body
        .text-center(v-if="isLoading")
          loading-panel

        .text-center(v-else-if="false")
          i No accounts found...

        div.mt-2(v-else)
          card
            p #[i.now-ui-icons.users_circle-08.mr-2] Facebook
            p #[i.now-ui-icons.business_badge.mr-2] john.doe@gmail.com
            p #[i.now-ui-icons.travel_info.mr-2] This is my Facebook account..
          card
            p #[i.now-ui-icons.users_circle-08.mr-2] Instagram
            p #[i.now-ui-icons.business_badge.mr-2] john.doe@yahoo.com
            p #[i.now-ui-icons.travel_info.mr-2] This is my Instagram account..

  .col-md-6
    card.p-4
      .text-center
        i No password selected yet..
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      isLoading: true,
      accountSearch: "",
    };
  },

  props: {
    id: { default: null },
  },

  computed: {
    ...mapState({
      activeNetwork: (state) => state.activeNetwork,
    }),
  },

  async created() {
    try {
      console.log("init");
    } catch (err) {
      this.$toast.error(err.message);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.card {
  cursor: pointer;
  margin-bottom: 0 !important;
  box-shadow: 0 1px 3px 1px rgba(39, 39, 39, 0.1) !important;
}
</style>
