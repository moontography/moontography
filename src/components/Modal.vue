<template>
  <div
    class="modal fade"
    :id="id"
    :class="[{ 'modal-mini': type === 'mini' }]"
    tabindex="-1"
    role="dialog"
  >
    <div
      class="modal-dialog"
      :class="[{ 'modal-notice': type === 'notice' }, modalClasses]"
    >
      <div class="modal-content">
        <div class="modal-header" :class="headerClasses" v-if="showHeader">
          <slot name="close-button">
            <button
              type="button"
              v-if="showClose"
              class="close"
              data-dismiss="modal"
            >
              <i class="now-ui-icons ui-1_simple-remove"></i>
            </button>
          </slot>
          <slot name="header"></slot>
        </div>

        <div class="modal-body" :class="bodyClasses">
          <slot></slot>
        </div>

        <div
          class="modal-footer"
          :class="footerClasses"
          v-if="showFooter && $slots.footer"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "modal",
  props: {
    id: String,
    showHeader: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "",
      validator(value) {
        let acceptedValues = ["", "notice", "mini"];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    modalClasses: [Object, String],
    headerClasses: [Object, String],
    bodyClasses: [Object, String],
    footerClasses: [Object, String],
  },
};
</script>
<style>
.modal.show {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
