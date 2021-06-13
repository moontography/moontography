<template lang="pug">
div.user.mt-0.pb-2
  li
    a.no-hover.d-flex.align-items-center
      i.mr-3.now-ui-icons.business_bank(v-if="!isConnected")
      div.mr-2(v-else) #[img(style ="max-height: 30px" :src="activeNetworkLogo")]
      p.flex-fill(style="line-height: 1rem;")
        user-address
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "user-menu",

  computed: mapState({
    isConnected: (state) => state.web3.isConnected,
    activeNetworkLogo: (_, getters) => getters.activeNetworkLogo,
  }),
};
</script>
