import airdropper from "./airdropper";
import asaas from "./asaas";
import faas from "./faas";
import kether from "./kether";
import passwordManager from "./passwordManager";
import trustedTimestamping from "./trustedTimestamping";

export default {
  ...airdropper,
  ...asaas,
  ...faas,
  ...kether,
  ...passwordManager,
  ...trustedTimestamping,

  globalError: null,
  globalLoading: false,
  initLoading: true,
  refreshableInterval: null,
  route: null,
  zeroAddy: "0x0000000000000000000000000000000000000000",
  moralisApiKey:
    "NSKfhloCF479195Dcy17lo4WWGyx4kQENDhK3iOlXpRSM8wto3aS64t10sfsrbFi",

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
          atomicSwap: "0x5b88b0CFAF3f97fb1a66B16681F6E502Ec03627e",
          atomicSwap_V1: "0x3d2C8A4a5785fce1bCF86481510d505371c0556d",
          passwordManager: "0xf67f6A36d751677D67069F359Be7623c4ea04524",
          trustedTimestamping: "0x5Cfc47359381526615F7EB91D8460F4Eb73534e1",
          faas: "0xaA0c2852F5391919b8AcE9ac079cf3791E5fE7e7",
          faas_V12: "0xdBD8E0c519B0832a2037D18f32f304C3aDDEA723",
          faas_V13: "0x1e07f7ad3e722F434604e7617d6DAe0a9A48a878",
        },
        buy: {
          link:
            "https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&outputCurrency=0x025c9f1146d4d94f8f369b9d98104300a3c8ca23",
          img: "img/pancakeswap.png",
          text: "PancakeSwap",
        },
      },
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
          atomicSwap: "0xa6C81ea7a97432f330F878650A5d5d376795D919",
          atomicSwap_V1: "0x48d6F1Fa74ec4E752b5f7f3cf112aC783251713D",
          passwordManager: "0xc8DD32752abe732Bc586dd42740895B6736619e2",
          trustedTimestamping: "0x266BFfc052a5F02d4797A3DD99C3455Ac9D49eb6",
          faas: "0x306996a2F45F3CA3472cABa245d772D566d4aab7",
          faas_V13: "0x5Cfc47359381526615F7EB91D8460F4Eb73534e1",
          kether: "0xb5fe93ccfec708145d6278b0c71ce60aa75ef925",
          ketherNFT: "0x7bb952AB78b28a62b1525acA54A71E7Aa6177645",
          ketherNFTLoaner: "0x6d02744ef4418CB0D72f54c1eE53140430b9dBEd",
        },
        buy: {
          link:
            "https://app.uniswap.org/#/swap?outputCurrency=0x025c9f1146d4d94f8f369b9d98104300a3c8ca23",
          img: "img/uniswap.png",
          text: "Uniswap",
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
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        logo: `img/kucoin.png`,
        contracts: {
          mtgy: "0xee00ef5a7ec4fdbd04eee39d60fe11c0ded65e73",
          mtgySpend: "0x2060539895f6ef746336471001cEC66BfBf591d9",
          airdropper: "0x025c9f1146d4d94F8F369B9d98104300A3c8ca23",
          atomicSwap: "0xae31AbAef5F7000E469AED538f8e2A2a88661fF1",
          atomicSwap_V1: "0x455D17B815f822F2D8aFd3Aa15F18518427E201e",
          passwordManager: "0x8A31f723FBfa371308e5f5Dd637246E0F6C573a5",
          trustedTimestamping: "0xc8DD32752abe732Bc586dd42740895B6736619e2",
          faas: "0x51807E0745bC0c4A2534Ca7531F20E3C0F2a73Dc",
          faas_V13: "0x04113Df9713E857FF25c8D46295637ef4cBA7263",
        },
        buy: {
          link: "https://koffeeswap.exchange/#/pro",
          img: "img/koffeeswap.png",
          text: "KoffeeSwap",
        },
      },
      {
        name: "Polygon Mainnet",
        short_name: "matic",
        chain: "MATIC",
        network: "mainnet",
        chain_id: 137,
        network_id: 1,
        explorer_url: "https://polygonscan.com/",
        rpc_url: "https://matic-mainnet.chainstacklabs.com",
        blocks_per_day: 33200,
        native_currency: {
          symbol: "MATIC",
          name: "MATIC",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        logo: `img/polygon.png`,
        contracts: {
          mtgy: "0x04113Df9713E857FF25c8D46295637ef4cBA7263",
          mtgySpend: "0x025c9f1146d4d94F8F369B9d98104300A3c8ca23",
          airdropper: "0x8A31f723FBfa371308e5f5Dd637246E0F6C573a5",
          atomicSwap: "0x8F70517bc8D336dB91f5f3f8aBB4B58e61786B83",
          atomicSwap_V1: "0xc39E5a234Fe2CAD49263d985FF2178eeA1A06916",
          passwordManager: "0xc8DD32752abe732Bc586dd42740895B6736619e2",
          trustedTimestamping: "0x266BFfc052a5F02d4797A3DD99C3455Ac9D49eb6",
          faas: "0x40c29F3A0248Dd2d8Eb5917E8de1574dE9f9A253",
          faas_V13: "0xf99693b010e35B38274835CE91ccCBb1eB89B32A",
        },
        // buy: {
        //   link: "https://koffeeswap.exchange/#/pro",
        //   img: "img/koffeeswap.png",
        //   text: "KoffeeSwap",
        // },
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
        short_name: "rinkeby",
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
          airdropper: "0x94E9cEE0Af5aF7347D1e4D82cC1e3e446b0e2B4a",
          atomicSwap: "0x9Ea2E96614931E7ad88F1FBcD83198e0cC98e471",
          passwordManager: "0xAb6A86dE3B47A0e71a097a84ec8Bdf7AaB0A52b6",
          trustedTimestamping: "0x2a1D590BC4C86bbb9118ED4f61e2D139c738cA0C",
          faas: "0xEC517E8d195A62DEFEb30ce63CebfCE610bF39E4",
          kether: "0xb88404dd8fe4969ef67841250baef7f04f6b1a5e",
          ketherNFT: "0xB7fCb57a5ce2F50C3203ccda27c05AEAdAF2C221",
          ketherNFTLoaner: "0xFe06A1E83Dc24a1EF7bdCa74D708522AADA152c5",
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
    ],
  },

  xlm: {
    usdToSend: "5",
  },
};
