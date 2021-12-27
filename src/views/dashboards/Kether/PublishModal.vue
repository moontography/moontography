<template lang="pug">
.modal.fade(
  tabindex='-1'
  role='dialog'
  aria-hidden='true'
  v-loading="globalLoading")
    .modal-dialog.modal-lg
      .modal-content
        .modal-header.border-bottom.pb-3
          h3.modal-title.d-flex.align-items-center
            | #[i.now-ui-icons.users_circle-08.mr-2]
            | Publish Plot!
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body
          div.text-center
            | Update your ad information, link, image, etc. here!
          div.my-4.d-flex.justify-content-center(v-if="ad.image")
            img(
              :title="ad.title"
              :style="{borderRadius: '0px', width: `${plot.width * 10}px`, height: `${plot.height * 10}px`}"
              :src="ad.image")
          hr
          label Ad Title (can be changed later)
          fg-input.mb-3(
            type="text"
            placeholder="Title"
            v-model="ad.title")
          label Ad Link (can be changed later)
          fg-input.mb-3(
            type="text"
            placeholder="Link"
            v-model="ad.link")
          label Ad Image URL (can be changed later)
          fg-input.mb-3(
            type="text"
            placeholder="Image Link"
            v-model="ad.image")
          checkbox(v-model="ad.NSFW") 
            label Is ad risque or otherwise not safe for school/work?
          div.mt-1.d-flex.align-items-center.justify-content-center
            n-button(
              type="primary"
              :disabled="globalLoading"
              v-loading="globalLoading"
              @click="publishPlot") Publish!
</template>

<script>
import $ from "jquery";
import { mapState } from "vuex";
export default {
  props: {
    plot: { type: Object, required: true },
  },

  data() {
    return {
      ad: {
        title: null,
        link: null,
        image: null,
        NSFW: false,
      },
    };
  },

  computed: {
    ...mapState({
      globalLoading: (state) => state.globalLoading,
    }),
  },

  methods: {
    async publishPlot() {
      try {
        this.$store.commit("SET_GLOBAL_LOADING", true);
        await this.$store.dispatch("publishPlot", {
          index: this.plot.index,
          publishInfo: [
            this.ad.link || "",
            this.ad.image || "",
            this.ad.title || "",
            this.ad.NSFW || false,
          ],
        });
        await this.$store.dispatch("getAllKetherPlots", true);
        this.$toast.success(`Successfully published plot!`);
        $(`#${this.$el.id}`).modal("hide");
      } catch (err) {
        this.$toast.error(err.message);
      } finally {
        this.$store.commit("SET_GLOBAL_LOADING", false);
      }
    },
  },

  beforeUnmount() {
    $(`#${this.$el.id}`).remove();
  },
};
</script>
