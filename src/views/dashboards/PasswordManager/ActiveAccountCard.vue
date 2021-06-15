<template lang="pug">
card.p-2
  .card-body
    div.d-flex.align-items-center
      h3.m-0.d-flex.align-items-center #[i.now-ui-icons.users_circle-08.mr-2] {{ account.name }}
      router-link.ml-auto(to="/passwords")
        button.close.text-danger(type='button')
          span(aria-hidden='true') &times;
    hr.mb-4
    
    div.d-flex.align-items-center #[i.now-ui-icons.business_badge.mr-1] Username:
    b {{ account.email }}
    
    div.mt-4.d-flex.align-items-center #[i.fa.fa-lock.mr-1] Password: 
    b.clickable(@click="toggleShowPassword(account.id)")
      | {{ showPassword ? `${account.password} (click to hide)` : '(click to show)' }}

    template(v-if="account.info")
      div.d-flex.align-items-center.mt-4 #[i.now-ui-icons.travel_info.mr-1] Additional Info: 
      b {{ account.info }}
</template>
<script>
export default {
  props: {
    account: { type: Object, required: true },
  },

  data() {
    return {
      isLoading: true,
      accountSearch: "",
      showPassword: false,
    };
  },

  methods: {
    toggleShowPassword(accountId) {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>
