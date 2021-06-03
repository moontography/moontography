<template lang="pug">
.modal.fade(
  tabindex='-1'
  role='dialog'
  aria-labelledby='hash-list-modal'
  aria-hidden='true')
    .modal-dialog.modal-xl
      .modal-content
        .modal-header.border-0
          h5.modal-title Your Data Hashes
          button.close(type='button' data-dismiss='modal' aria-label='Close')
            span(aria-hidden='true') &times;
        .modal-body.p-0
          div.table-responsive
            table.table.table-striped.table-bordered.m-0
              thead
                tr
                  th Time
                  th File
                  th File Size
                  th Hash
              tbody
                tr(v-if="!hashes || hashes.length === 0")
                  td(colspan="100%")
                    i No hashes stored yet for your address yet...
                tr(v-else v-for="hash in parsedHashes")
                  td {{ hash.time }}
                  td {{ hash.fileName }}
                  td {{ hash.fileSizeBytes }}
                  td {{ hash.dataHash }}
</template>

<script>
import dayjs from "dayjs";
import { mapState } from "vuex";

export default {
  name: "TTHashListModal",

  computed: {
    ...mapState({
      hashes: (state) => state.trustedTimestamping.hashes,
    }),

    parsedHashes() {
      return (
        this.hashes &&
        this.hashes.map((h) => ({
          ...h,
          time: dayjs(Number(h.time) * 1e3).toISOString(),
        }))
      );
    },
  },
};
</script>
