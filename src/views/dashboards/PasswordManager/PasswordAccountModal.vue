<template lang="pug">
.modal.fade(
  tabindex='-1'
  role='dialog'
  aria-labelledby='password-account-modal'
  aria-hidden='true')
    .modal-dialog.modal-lg
      .modal-content
        .modal-header
          h3.modal-title #[i.now-ui-icons.users_circle-08.mr-2] Account
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          form(@submit.prevent="onSubmit")
            div
              fg-input.mb-4(
                label="Name"
                type="text"
                placeholder="Enter account name"
                v-model="account.name"
              )

              fg-input.mb-4(
                label="Email Address"
                type="email"
                placeholder="Enter email"
                v-model="account.email"
              )
           
              fg-input.mb-4(label="Password" type="password" placeholder="Enter password" v-model="account.password")

              fg-input.mb-4(
                label="Additional Info"
                type="text"
                placeholder="Enter additional information"
                v-model="account.info"
              )
  
              div.d-flex
                button.btn.btn-primary.ml-auto(type="submit") Submit
</template>

<script>
export default {
  name: "PasswordAccountModal",

  props: {
    account: { type: Object, default: defaultAccount() },
  },

  methods: {
    onSubmit() {
      console.log("submit");
    },
  },
};

function defaultAccount() {
  return {
    name: null,
    email: null,
    password: null,
    info: null,
  };
}
</script>
