import Web3 from "web3";
import Web3Modal from "web3modal";

export default function CustomWeb3Modal(options: any) {
  return {
    async connect() {
      const providerOptions = {
        /* See Provider Options Section */
        ...options,
      };

      const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions, // required
      });

      const provider = await web3Modal.connect();

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

      return new Web3(provider);
    },
  };
}
