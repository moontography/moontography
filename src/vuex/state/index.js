import passwordManager from "./passwordManager";
import trustedTimestamping from "./trustedTimestamping";

export default {
  ...passwordManager,
  ...trustedTimestamping,

  globalError: null,
  globalLoading: false,
  initLoading: true,
  refreshableInterval: null,

  activeNetwork: localStorage.activeNetwork || "eth",
  mtgyCircSupply: "0",
  mtgyPriceUsd: "0",
  currentBlock: "0",
  mtgyTokenInfo: {
    community_data: {},
    market_data: {
      market_cap: {},
      fully_diluted_valuation: {},
      total_volume: {},
    },
  },
  mtgyChart: [],

  web3: {
    instance: null,
    isConnected: false,
    chainId: null,
    address: "",
    userMtgyBalance: "",
    mainCurrencyBalance: "",
  },

  selectedAddressInfo: {
    address: "",
    name: "",
    symbol: "",
    decimals: "",
    userBalance: "",
  },

  eth: {
    networks: [
      // {
      //   name: "Ethereum Mainnet",
      //   short_name: "eth",
      //   chain: "ETH",
      //   network: "mainnet",
      //   chain_id: 1,
      //   network_id: 1,
      //   rpc_url: "https://mainnet.infura.io/v3/%API_KEY%",
      //   native_currency: {
      //     symbol: "ETH",
      //     name: "Ethereum",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: ""
      //   }
      // },
      // {
      //   name: "Ethereum Ropsten",
      //   short_name: "rop",
      //   chain: "ETH",
      //   network: "ropsten",
      //   chain_id: 3,
      //   network_id: 3,
      //   rpc_url: "https://ropsten.infura.io/v3/%API_KEY%",
      //   native_currency: {
      //     symbol: "ETH",
      //     name: "Ethereum",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: ""
      //   }
      // },
      {
        name: "Ethereum Rinkeby",
        short_name: "rin",
        chain: "ETH",
        network: "rinkeby",
        chain_id: 4,
        network_id: 4,
        rpc_url: "https://rinkeby.infura.io/v3/%API_KEY%",
        native_currency: {
          symbol: "ETH",
          name: "Ethereum",
          decimals: "18",
          contractAddress: "",
          balance: "",
        },
        contracts: {
          mtgy: "0xB0c227318439Aed30140e1E589a3c3b514d15BDF",
          mtgySpend: "0xD3d649fB54266EB65693b051539295493e79836F",
          passwordManager: "0xAb6A86dE3B47A0e71a097a84ec8Bdf7AaB0A52b6",
          trustedTimestamping: "0x2a1D590BC4C86bbb9118ED4f61e2D139c738cA0C",
          faas: "0x7De398556D1048d51450192c3196ACE787888d0F",
        },
      },
      // {
      //   name: "Ethereum Görli",
      //   short_name: "gor",
      //   chain: "ETH",
      //   network: "goerli",
      //   chain_id: 5,
      //   network_id: 5,
      //   rpc_url: "https://goerli.infura.io/v3/%API_KEY%",
      //   native_currency: {
      //     symbol: "ETH",
      //     name: "Ethereum",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: ""
      //   }
      // },
      // {
      //   name: "RSK Mainnet",
      //   short_name: "rsk",
      //   chain: "RSK",
      //   network: "mainnet",
      //   chain_id: 30,
      //   network_id: 30,
      //   rpc_url: "https://public-node.rsk.co",
      //   native_currency: {
      //     symbol: "RSK",
      //     name: "RSK",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: ""
      //   }
      // },
      // {
      //   name: "Ethereum Kovan",
      //   short_name: "kov",
      //   chain: "ETH",
      //   network: "kovan",
      //   chain_id: 42,
      //   network_id: 42,
      //   rpc_url: "https://kovan.infura.io/v3/%API_KEY%",
      //   native_currency: {
      //     symbol: "ETH",
      //     name: "Ethereum",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: ""
      //   }
      // },
      // {
      //   name: "Ethereum Classic Mainnet",
      //   short_name: "etc",
      //   chain: "ETC",
      //   network: "mainnet",
      //   chain_id: 61,
      //   network_id: 1,
      //   rpc_url: "https://ethereumclassic.network",
      //   native_currency: {
      //     symbol: "ETH",
      //     name: "Ethereum",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: ""
      //   }
      // },
      // {
      //   name: "POA Network Sokol",
      //   short_name: "poa",
      //   chain: "POA",
      //   network: "sokol",
      //   chain_id: 77,
      //   network_id: 77,
      //   rpc_url: "https://sokol.poa.network",
      //   native_currency: {
      //     symbol: "POA",
      //     name: "POA",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: ""
      //   }
      // },
      // {
      //   name: "POA Network Core",
      //   short_name: "skl",
      //   chain: "POA",
      //   network: "core",
      //   chain_id: 99,
      //   network_id: 99,
      //   rpc_url: "https://core.poa.network",
      //   native_currency: {
      //     symbol: "POA",
      //     name: "POA",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: ""
      //   }
      // },
      // {
      //   name: "xDAI Chain",
      //   short_name: "xdai",
      //   chain: "POA",
      //   network: "dai",
      //   chain_id: 100,
      //   network_id: 100,
      //   rpc_url: "https://dai.poa.network",
      //   native_currency: {
      //     symbol: "xDAI",
      //     name: "xDAI",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: ""
      //   }
      // },
      // {
      //   name: "Callisto Mainnet",
      //   short_name: "clo",
      //   chain: "callisto",
      //   network: "mainnet",
      //   chain_id: 820,
      //   network_id: 1,
      //   rpc_url: "https://clo-geth.0xinfra.com/",
      //   native_currency: {
      //     symbol: "CLO",
      //     name: "CLO",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: ""
      //   }
      // },
      {
        name: "Binance Smart Chain",
        short_name: "bsc",
        chain: "smartchain",
        network: "mainnet",
        chain_id: 56,
        network_id: 56,
        rpc_url: "https://bsc-dataseed1.defibit.io/",
        native_currency: {
          symbol: "BNB",
          name: "BNB",
          decimals: "18",
          contractAddress: "",
          balance: "",
        },
        logo: `img/bsc.png`,
        contracts: {
          mtgy: "0x025c9f1146d4d94F8F369B9d98104300A3c8ca23",
          mtgySpend: "0x8F70517bc8D336dB91f5f3f8aBB4B58e61786B83",
          passwordManager: "0x2f74DFc0753d9DD7E67a27ef8789745a8086b28F",
          trustedTimestamping: "0x5Cfc47359381526615F7EB91D8460F4Eb73534e1",
          faas: "0x1E01101aF412E4510E22D7cb1Faf6f5E5eA3fDA4",
        },
      },
    ],
  },

  xlm: {
    usdToSend: "5",
  },
};
