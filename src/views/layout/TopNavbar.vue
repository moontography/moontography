<template lang="pug">
navbar#navigation(:show-navbar="showNavbar")
  div.navbar-wrapper
    div.navbar-toggle(:class="{ toggled: $sidebar.showSidebar }")
      navbar-toggle-button(@click="toggleSidebar")
    router-link.navbar-brand(to="/") {{ $route.name }}
  //- button(
  //-   @click="toggleNavbar"
  //-   class="navbar-toggler"
  //-   type="button"
  //-   data-toggle="collapse"
  //-   data-target="#navigation"
  //-   aria-controls="navigation-index"
  //-   aria-expanded="false"
  //-   aria-label="Toggle navigation")
  //-   span.navbar-toggler-bar.navbar-kebab
  //-   span.navbar-toggler-bar.navbar-kebab
  //-   span.navbar-toggler-bar.navbar-kebab

  template(v-slot:navbar-menu)
    ul.navbar-nav
      li.nav-item
        a.nav-link(
          title="Website"
          href="https://moontography.com"
          target="_blank"
          rel="noopener noreferrer")
            i.fa.fa-2x.fa-globe
      li.nav-item
        a.nav-link(
          title="Telegram"
          href="https://t.me/moontographyproject"
          target="_blank"
          rel="noopener noreferrer")
            i.fa.fa-2x.fa-telegram
      li.nav-item
        a.nav-link(
          title="Blog"
          href="https://blog.moontography.com"
          target="_blank"
          rel="noopener noreferrer")
            i.fa.fa-2x.fa-medium
      li.nav-item
        a.nav-link(
          title="GitHub"
          href="https://github.com/moontography"
          target="_blank"
          rel="noopener noreferrer")
            i.fa.fa-2x.fa-github
      drop-down(
        tag="li"
        position="right"
        class="nav-item"
        icon="now-ui-icons media-2_sound-wave"
      ) 
        a.dropdown-item(
          title="BscScan"
          href="https://bscscan.com/token/0x025c9f1146d4d94f8f369b9d98104300a3c8ca23"
          target="_blank"
          rel="noopener noreferrer")
            img(
              style="max-height: 20px"
              src="img/bscscan.png")
            span.ml-2 BscScan
        a.dropdown-item(
          title="CoinGecko"
          href="https://www.coingecko.com/en/coins/the-moontography-project"
          target="_blank"
          rel="noopener noreferrer")
            img(
              style="max-height: 20px"
              src="img/coingecko.png")
            span.ml-2 CoinGecko
        //- a.dropdown-item(
        //-   title="CoinMarketCap"
        //-   href="https://coinmarketcap.com/"
        //-   target="_blank"
        //-   rel="noopener noreferrer")
        //-     img(
        //-       style="max-height: 20px"
        //-       src="img/coinmarketcap.png")
        //-     span.ml-2 CoinMarketCap
        a.dropdown-item(
          title="DEXTools"
          href="https://www.dextools.io/app/pancakeswap/pair-explorer/0xaabafd64feb2ec235b209a95d4dc9b08e225379c"
          target="_blank"
          rel="noopener noreferrer")
            img(
              style="max-height: 20px"
              src="img/dextools.png")
            span.ml-2 DEXTools
        a.dropdown-item(
          title="Live Coin Watch"
          href="https://www.livecoinwatch.com/price/TheMoontographyProject-MTGY"
          target="_blank"
          rel="noopener noreferrer")
            img(
              style="max-height: 20px"
              src="img/livecoinwatch.png")
            span.ml-2 Live Coin Watch
        a.dropdown-item(
          title="PancakeSwap"
          href="https://exchange.pancakeswap.finance/#/swap?inputCurrency=0x025c9f1146d4d94F8F369B9d98104300A3c8ca23"
          target="_blank"
          rel="noopener noreferrer")
            img(
              style="max-height: 20px"
              src="img/pancakeswap-logo.png")
            span.ml-2 PancakeSwap
      drop-down.d-none.d-xl-block(
        tag="li"
        position="right"
        class="nav-item"
        :title="activeNetwork.name || 'Switch Network'")
          a.dropdown-item.clickable(
            v-for="network in allNetworks"
            @click="switchNetwork(network)")
              img(
                style="max-height: 20px"
                :src="network.logo || 'img/eth.png'")
              span.ml-2 {{ network.name }}
      li.nav-item
        a.nav-link.no-hover
          | Block: {{ currentBlock }}
      li.nav-item
        a.nav-link.no-hover
          | 1 MTGY = ${{ mtgyPriceUsd }} USD
      li.nav-item.d-none.d-xl-block
        a.nav-link.clickable(
          @click="addMtgyToMetaMask")
            img(
              style="max-height: 18px"
              src="img/metamask.png") 
            span.ml-2 Add MTGY to MetaMask
</template>
<script>
import BigNumber from "bignumber.js";
import { mapState } from "vuex";
import { Navbar, NavbarToggleButton } from "@/components";

export default {
  components: {
    Navbar,
    NavbarToggleButton,
  },
  computed: {
    ...mapState({
      activeNetwork: (_, getters) => getters.activeNetwork || {},
      allNetworks: (state) => state.eth.networks || [],
      currentBlock: (state) => state.currentBlock,
      mtgyPriceUsd: (state) => new BigNumber(state.mtgyPriceUsd).toFixed(6),
    }),

    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
  },
  data() {
    return {
      activeNotifications: false,
      showNavbar: false,
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    toggleNavbar() {
      this.showNavbar = !this.showNavbar;
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },

    async switchNetwork(network) {
      if (network.chain_id == this.activeNetwork.chain_id) return;
      if (!window.ethereum)
        return this.$toast.error(
          "Make sure you using a web3 enabled browser like Metamask, TrustWallet etc."
        );
      const hexId = network.chain_id.toString(16);
      const chainId = `0x${hexId}`;
      const chainName = network.name;
      const nativeCurrency = {
        name: network.native_currency.name,
        symbol: network.native_currency.symbol,
        decimals: network.native_currency.decimals,
      };
      const rpcUrls = [network.rpc_url];
      const blockExplorerUrls = [network.explorer_url];
      try {
        // If not mainnet, try to add network first
        if (network.chain_id != 1)
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId,
                chainName,
                nativeCurrency,
                rpcUrls,
                blockExplorerUrls,
              },
            ],
          });
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId,
            },
          ],
        });
      } catch (error) {
        this.$toast.error(error.message);
      }
    },

    async addMtgyToMetaMask() {
      const tokenAddress = this.activeNetwork.contracts.mtgy;
      const tokenSymbol = "MTGY";
      const tokenDecimals = 18;

      if (!window.ethereum)
        return this.$toast.error(
          "Make sure you using a web3 enabled browser like Metamask, TrustWallet etc."
        );

      // https://docs.metamask.io/guide/registering-your-token.html#code-free-example
      try {
        /* const wasAdded = */ await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
            },
          },
        });

        // if (wasAdded) {
        //   this.$toast.success("Token contract added to MetaMask wallet!");
        // } else {
        //   this.$toast.error("Token contract was not added to MetaMask wallet.");
        // }
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
  },
};
</script>
<style lang="scss">
a {
  &.nav-link.no-hover:hover {
    background: inherit !important;
  }
}

img.gray {
  filter: grayscale(100%);
}
</style>
