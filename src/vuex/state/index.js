import airdropper from "./airdropper";
import asaas from "./asaas";
import faas from "./faas";
import kether from "./kether";
import passwordManager from "./passwordManager";
import raffler from "./raffler";
import trustedTimestamping from "./trustedTimestamping";

export default {
  ...airdropper,
  ...asaas,
  ...faas,
  ...kether,
  ...passwordManager,
  ...raffler,
  ...trustedTimestamping,

  globalError: null,
  globalLoading: false,
  initLoading: true,
  initFinished: false,
  refreshableInterval: null,
  route: null,
  zeroAddy: "0x0000000000000000000000000000000000000000",
  moralisApiKey:
    "NSKfhloCF479195Dcy17lo4WWGyx4kQENDhK3iOlXpRSM8wto3aS64t10sfsrbFi",

  productIds: {
    airdropper: 1,
    passwordManager: 2,
    trustedTimestamping: 3,
    raffler: 4,
    tokenLocker: 5,
    atomicSwap: 6,
    atomicSwapInstance: 7,
    faas: 8,
  },

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

  oklgPriceUsd: "0",
  mtgyOklgRatio: "0",

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
          oklg: "0x55e8b37a3c43b049dedf56c77f462db095108651",
          spend: "",
          airdropper: "",
          atomicSwap: "",
          passwordManager: "",
          raffler: "",
          trustedTimestamping: "",
          faas: "",
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
          oklg: "0x5dbb9f64cd96e2dbbca58d14863d615b67b42f2e",
          spend: "",
          airdropper: "",
          atomicSwap: "",
          passwordManager: "",
          raffler: "",
          trustedTimestamping: "",
          faas: "",
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
        blocks_per_day: 28800,
        native_currency: {
          symbol: "KCS",
          name: "KCS",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        logo: `img/kucoin.png`,
        contracts: {
          oklg: "",
          spend: "",
          airdropper: "",
          atomicSwap: "",
          passwordManager: "",
          raffler: "",
          trustedTimestamping: "",
          faas: "",
        },
        buy: {
          link:
            "https://koffeeswap.exchange/#/pro/KCS/0xeE00eF5a7EC4fDbD04eeE39d60Fe11C0DeD65e73",
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
        rpc_url: "https://polygon-rpc.com",
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
          oklg: "",
          spend: "",
          airdropper: "",
          atomicSwap: "",
          passwordManager: "",
          raffler: "",
          trustedTimestamping: "",
          faas: "",
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
      // {
      //   name: "Ethereum Rinkeby",
      //   short_name: "rinkeby",
      //   chain: "ETH",
      //   network: "rinkeby",
      //   chain_id: 4,
      //   network_id: 4,
      //   explorer_url: "https://rinkeby.etherscan.io",
      //   rpc_url: "https://rinkeby.infura.io/v3/%API_KEY%",
      //   blocks_per_day: 6450,
      //   native_currency: {
      //     symbol: "ETH",
      //     name: "Ethereum",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: "",
      //   },
      //   contracts: {
      //     oklg: "0x5f67df361f568e185aA0304A57bdE4b8028d059E",
      //     spend: "",
      //     airdropper: "",
      //     atomicSwap: "",
      //     passwordManager: "",
      //     raffler: "",
      //     trustedTimestamping: "",
      //     faas: "",
      //     kether: "0xb88404dd8fe4969ef67841250baef7f04f6b1a5e",
      //     ketherNFT: "0xB7fCb57a5ce2F50C3203ccda27c05AEAdAF2C221",
      //     ketherNFTLoaner: "0xFe06A1E83Dc24a1EF7bdCa74D708522AADA152c5",
      //   },
      // },
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
