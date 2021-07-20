import airdropper from "./airdropper";
import asaas from "./asaas";
import faas from "./faas";
import passwordManager from "./passwordManager";
import trustedTimestamping from "./trustedTimestamping";

export default {
  ...airdropper,
  ...asaas,
  ...faas,
  ...passwordManager,
  ...trustedTimestamping,

  globalError: null,
  globalLoading: false,
  initLoading: true,
  refreshableInterval: null,
  zeroAddy: "0x0000000000000000000000000000000000000000",

  activeNetwork: localStorage.activeNetwork || "eth",
  mtgyCircSupply: "0",
  mtgyTotSupply: "0",
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
      {
        name: "Ethereum Mainnet",
        short_name: "eth",
        chain: "ETH",
        network: "mainnet",
        chain_id: 1,
        network_id: 1,
        explorer_url: "https://etherscan.io",
        rpc_url: "https://mainnet.infura.io/v3/%API_KEY%",
        blocks_per_day: 6450,
        native_currency: {
          symbol: "ETH",
          name: "Ethereum",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        contracts: {
          mtgy: "0x025c9f1146d4d94F8F369B9d98104300A3c8ca23",
          mtgySpend: "0x8A31f723FBfa371308e5f5Dd637246E0F6C573a5",
          airdropper: "0x8f70517bc8d336db91f5f3f8abb4b58e61786b83",
          atomicSwap: "",
          passwordManager: "0xc8DD32752abe732Bc586dd42740895B6736619e2",
          trustedTimestamping: "0x266BFfc052a5F02d4797A3DD99C3455Ac9D49eb6",
          faas: "0x5Cfc47359381526615F7EB91D8460F4Eb73534e1",
        },
      },
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
        explorer_url: "https://rinkeby.etherscan.io",
        rpc_url: "https://rinkeby.infura.io/v3/%API_KEY%",
        blocks_per_day: 6450,
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
          airdropper: "0x7A4C2Fb27CE63985197F5cCbA281532a1F49B373",
          atomicSwap: "0xbE92523cc4d09776628dDc352dfa02A25E61616e",
          passwordManager: "0xAb6A86dE3B47A0e71a097a84ec8Bdf7AaB0A52b6",
          trustedTimestamping: "0x2a1D590BC4C86bbb9118ED4f61e2D139c738cA0C",
          faas: "0xe922A7dE0Ec592F48cd0944318e9ac7DaaF67FA4",
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
        explorer_url: "https://bscscan.com",
        rpc_url: "https://bsc-dataseed.binance.org/",
        blocks_per_day: 28800,
        native_currency: {
          symbol: "BNB",
          name: "BNB",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        logo: `img/bsc.png`,
        contracts: {
          mtgy: "0x025c9f1146d4d94F8F369B9d98104300A3c8ca23",
          mtgySpend: "0x8F70517bc8D336dB91f5f3f8aBB4B58e61786B83",
          airdropper: "0xeFD47d675683c2788f8171Fede12A1505D07c2B2",
          atomicSwap: "0x47A576dE60Dd8C8Fab33810bF3EE81783F23d629",
          passwordManager: "0xf67f6A36d751677D67069F359Be7623c4ea04524",
          trustedTimestamping: "0x5Cfc47359381526615F7EB91D8460F4Eb73534e1",
          faas: "0x30F401b07b20f5F68e40858117e85A223D43d35E",
          faas_V12: "0xdBD8E0c519B0832a2037D18f32f304C3aDDEA723",
        },
      },
      {
        name: "Kucoin Mainnet",
        short_name: "kcc",
        chain: "KCC",
        network: "mainnet",
        chain_id: 321,
        network_id: 1,
        explorer_url: "https://explorer.kcc.io/en",
        rpc_url: "https://rpc-mainnet.kcc.network",
        blocks_per_day: 14400,
        native_currency: {
          symbol: "KCS",
          name: "KCS",
          decimals: "18",
          contractAddress: "",
          balance: "",
        },
        logo: `img/kucoin.png`,
        contracts: {
          mtgy: "0xee00ef5a7ec4fdbd04eee39d60fe11c0ded65e73",
          mtgySpend: "0x2060539895f6ef746336471001cEC66BfBf591d9",
          airdropper: "0x025c9f1146d4d94F8F369B9d98104300A3c8ca23",
          atomicSwap: "0x306907862C6cDa1Ee7AC5f59c8C295FcE27f6889",
          passwordManager: "0x8A31f723FBfa371308e5f5Dd637246E0F6C573a5",
          trustedTimestamping: "0xc8DD32752abe732Bc586dd42740895B6736619e2",
          faas: "0x04113Df9713E857FF25c8D46295637ef4cBA7263",
        },
      },
    ],
  },

  xlm: {
    usdToSend: "5",
  },
};
