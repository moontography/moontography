import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

interface IWeb3 {
  provider?: any;
  web3?: any;
  connect: any;
  bindProviderEvents: any;
}

const NOOP = () => {};

export default {
  provider: null,
  web3: null,
  web3Modal: null,

  async connect(options: any) {
    if (this.provider && this.web3)
      return { provider: this.provider, web3: this.web3 };

    const providerOptions = {
      /* See Provider Options Section */
      ...options,

      // https://infura.io/dashboard/ethereum
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          custom: {
            "1":
              "https://eth.getblock.io/mainnet/?api_key=ff48b009-d727-453f-b36c-e53c2a015053",
            "56":
              "https://bsc.getblock.io/mainnet/?api_key=ff48b009-d727-453f-b36c-e53c2a015053",
          },
        },
      },
    };

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    const provider = await web3Modal.connect();

    this.provider = provider;
    this.web3 = new Web3(provider);
    this.web3Modal = web3Modal;
    return { provider: this.provider, web3: this.web3 };
  },

  // // Subscribe to accounts change
  // provider.on("accountsChanged", (accounts: string[]) => {
  //   console.log(accounts);
  // });

  // // Subscribe to chainId change
  // provider.on("chainChanged", (chainId: number) => {
  //   console.log(chainId);
  // });

  // // Subscribe to provider connection
  // provider.on("connect", (info: { chainId: number }) => {
  //   console.log(info);
  // });

  // // Subscribe to provider disconnection
  // provider.on("disconnect", (error: { code: number; message: string }) => {
  //   console.log(error);
  // });
  bindProviderEvents({
    accountsChanged,
    chainChanged,
    connect,
    disconnect,
  }: any) {
    if (!this.provider)
      throw new Error(
        `Make sure to connect first before binding provider events.`
      );

    this.provider.on("accountsChanged", accountsChanged || NOOP);
    this.provider.on("chainChanged", chainChanged || NOOP);
    this.provider.on("connect", connect || NOOP);
    this.provider.on("disconnect", disconnect || NOOP);
  },

  // Clear cached provider for Web3Modal
  clearCachedProvider() {
    this.web3Modal.clearCachedProvider();
  },
} as IWeb3;
