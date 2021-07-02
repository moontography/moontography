<template lang="pug">
.modal.fade(
  tabindex='-1'
  role='dialog'
  aria-labelledby='disclaimer-modal'
  aria-hidden='true')
    .modal-dialog.modal-lg
      .modal-content
        .modal-header.border-bottom.pb-3.justify-content-center
          h3.modal-title.d-flex.align-items-center.text-danger
            | #[i.fa.fa-exclamation-triangle.mr-1]
            | Disclaimer
          //- button.close(type='button' data-dismiss='modal' aria-label='Close')
          //-   span(aria-hidden='true') &times;
        .modal-body
          div.ml-4
            | Moontography is a decentralized suite of applications that anyone can leverage.
            br
            | Anyone can create their own token.
            br
            | Tokens can be clones and can have the same name as existing tokens.
            br
            | Token creators can pretend to be owners of the real project. 
            br
            | Please do your own research and examine every project to avoid scams.
            | We are not responsible for loss while using our platform because of lack of
            | due diligence or research conducted.
          div.d-flex.align-items-center.justify-content-center.mt-4
            checkbox(v-model="disclaimerAccepted") 
              b.text-danger I understand that I am responsible for doing my own research!
          
        .modal-footer.m-4
          //- button.btn.btn-close(
          //-   data-dismiss='modal') Cancel
          button.btn.btn-success.ml-auto(
            v-loading="globalLoading"
            :disabled="!disclaimerAccepted"
            data-dismiss='modal'
            @click="$emit('confirm')") Confirm
            
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "DisclaimerModal",

  emits: ["confirm"],

  data() {
    return {
      disclaimerAccepted: false,
    };
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
    }),
  },

  methods: {},

  async mounted() {},
};
</script>
