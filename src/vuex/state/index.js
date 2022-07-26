import airdropper from "./airdropper";
import alpha from "./alpha";
import asaas from "./asaas";
import buybot from "./buybot";
import faas from "./faas";
import kether from "./kether";
import passwordManager from "./passwordManager";
import raffler from "./raffler";
import trustedTimestamping from "./trustedTimestamping";

export default {
  ...airdropper,
  ...alpha,
  ...asaas,
  ...buybot,
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
  tokenCircSupply: "0",
  tokenTotSupply: "0",
  currentBlock: "0",
  platformTokenInfo: {
    community_data: {},
    market_data: {
      market_cap: {},
      fully_diluted_valuation: {},
      total_volume: {},
    },
  },
  platformTokenChart: [],

  oklgPriceUsd: "0",
  mtgyOklgRatio: "0",

  web3: {
    instance: null,
    isConnected: false,
    chainId: null,
    address: "",
    userTokenBalance: "",
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
        name: "Arbitrum",
        short_name: "arbitrum",
        chain: "arbitrum",
        network: "arbitrum",
        chain_id: 42161,
        network_id: 42161,
        explorer_url: "https://arbiscan.io/",
        rpc_url: "https://arb1.arbitrum.io/rpc",
        blocks_per_day: 6450,
        native_currency: {
          symbol: "ETH",
          name: "ETH",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        logo: `img/arbitrum.png`,
        contracts: {
          oklg: "0x000000000000000000000000000000000000dEaD",
          spend: "0xd9b6F6e53c60802d278efE0C643D9C01BBd93abc",
          airdropper: "0x4aF14d5A9dba22eCAB3dCC05778d7ED229306F88",
          atomicSwap: "0x49866dC11F308a558Dc3E015eE88D54aFC4cB239",
          passwordManager: "0xcC3c31a1FE9801A53604CD17c2b27fD68CABa528",
          raffler: "0xc8238E9f4c81e9B3fCCd2c5D7D93AeE9e147Fdf4",
          trustedTimestamping: "0xCb9c8e2F24Fe6C738342eFd30d0d3c4fF31a0613",
          faas: "0x096A223d3B20bD3D1611803D06D18513c1B30EfB",
          buybot: "",
        },
      },
      {
        name: "Avalanche",
        short_name: "avax",
        chain: "avax",
        network: "avax",
        chain_id: 43114,
        network_id: 43114,
        explorer_url: "https://cchain.explorer.avax.network/",
        rpc_url: "https://api.avax.network/ext/bc/C/rpc",
        blocks_per_day: 28800,
        native_currency: {
          symbol: "AVAX",
          name: "AVAX",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        logo: `img/avax.png`,
        contracts: {
          oklg: "0x000000000000000000000000000000000000dEaD",
          spend: "0xd9b6F6e53c60802d278efE0C643D9C01BBd93abc",
          airdropper: "0x4aF14d5A9dba22eCAB3dCC05778d7ED229306F88",
          atomicSwap: "0xB4f60DF841C8225F3cc15799fCA2dD7b432Aa853",
          passwordManager: "0xcC3c31a1FE9801A53604CD17c2b27fD68CABa528",
          raffler: "0xc8238E9f4c81e9B3fCCd2c5D7D93AeE9e147Fdf4",
          trustedTimestamping: "0xCb9c8e2F24Fe6C738342eFd30d0d3c4fF31a0613",
          faas: "0x47BCC8De66D2607D70f70A5d313caa98dF06B16c",
          buybot: "",
        },
      },
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
          spend: "0x3B971D415671D9e909562aA02b02f0BfbD572c07",
          buybackAndBurn: "0x2796844A84D8eef9aE02e60C18Cd713Dd29659B7",
          airdropper: "0xFEA788C8e1C60b9C911265cAc63f4067AC1Ce42F",
          atomicSwap: "0x12B2B415cc5555e955B83a779644DF9eeFAF5140",
          passwordManager: "0x31FE24955A0de9c5a9818DAA8d7A614eFEdb5F34",
          raffler: "0x0525a5A67820af53066713BfC5c368BD2C8A570e",
          trustedTimestamping: "0xBa63F51f7Be4022dd7BfF997BC3245c5F651B381",
          faas: "0x717EDe6051acf094Ff043E2B3BcC4F86262742DD",
          faas_V1: "0x701666359E71b38d61C7faD2A121D7e6A6F1fFff",
          buybot: "0x22f373179F7182FD8B90E4F0B35D91966deabAFC",
          dexUtils: "0x738f7a7D2F7aF556321fae259b37d49034827E09",
        },
        buy: {
          link:
            "https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&outputCurrency=0x55e8b37a3c43b049dedf56c77f462db095108651",
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
          spend: "0x5bDE378E0a0ceBc941B03a579DA0088DC1616FAF",
          buybackAndBurn: "0xd501812C4FF29B0B95566a146078A218B1f7B78F",
          airdropper: "0x46510e381823Fe82d77d8F25ba78b0abD50eD444",
          atomicSwap: "0x967958DB20F9466d2fB3F1deE866671155Fb308f",
          passwordManager: "0x026132e2104ED39d9767334648052A731D0d483E",
          raffler: "0xBcA35f4b6343194c03C04c9340bAFD3de3E0284c",
          trustedTimestamping: "0xf02bc60b34A0656D35d7D57Bf9B535E945c4F1a9",
          faas: "0x7c2de66461Ba16839A5FeB5acC22a995036c3971",
          faas_V1: "0x521C1A07dB23cEEF2126EBf1924E31D55284918D",
          buybot: "0xF25B1e14F81BAcAc811A0e8F49cD8994AFC81012",
          kether: "0xb5fe93ccfec708145d6278b0c71ce60aa75ef925",
          ketherNFT: "0x7bb952AB78b28a62b1525acA54A71E7Aa6177645",
          ketherNFTLoaner: "0x6d02744ef4418CB0D72f54c1eE53140430b9dBEd",
          dexUtils: "0x738f7a7D2F7aF556321fae259b37d49034827E09",
        },
        buy: {
          link:
            "https://app.uniswap.org/#/swap?outputCurrency=0x5dbb9f64cd96e2dbbca58d14863d615b67b42f2e",
          img: "img/uniswap.png",
          text: "Uniswap",
        },
      },
      {
        name: "Fantom Opera",
        short_name: "ftm",
        chain: "ftm",
        network: "ftm",
        chain_id: 250,
        network_id: 250,
        explorer_url: "https://ftmscan.com/",
        rpc_url: "https://rpc.ftm.tools/",
        blocks_per_day: 28800,
        native_currency: {
          symbol: "FTM",
          name: "FTM",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        logo: `img/ftm.png`,
        contracts: {
          oklg: "0x000000000000000000000000000000000000dEaD",
          spend: "0xd9b6F6e53c60802d278efE0C643D9C01BBd93abc",
          airdropper: "0xcC3c31a1FE9801A53604CD17c2b27fD68CABa528",
          atomicSwap: "0x5dBB9F64cd96E2DbBcA58d14863d615B67B42f2e",
          passwordManager: "0xc8238E9f4c81e9B3fCCd2c5D7D93AeE9e147Fdf4",
          raffler: "0xCb9c8e2F24Fe6C738342eFd30d0d3c4fF31a0613",
          trustedTimestamping: "0x657bBa69DB9bf06D5BB2D0403867b41c08181630",
          faas: "0x3519a0EA62C2D75FF7b2fe39cDe791944DB3a0A5",
          buybot: "",
        },
      },
      // {
      //   name: "Kucoin Community Chain",
      //   short_name: "kcc",
      //   chain: "KCC",
      //   network: "mainnet",
      //   chain_id: 321,
      //   network_id: 1,
      //   explorer_url: "https://explorer.kcc.io/en",
      //   rpc_url: "https://rpc-mainnet.kcc.network",
      //   blocks_per_day: 28800,
      //   native_currency: {
      //     symbol: "KCS",
      //     name: "KCS",
      //     decimals: 18,
      //     contractAddress: "",
      //     balance: "",
      //   },
      //   logo: `img/kucoin.png`,
      //   contracts: {
      //     oklg: "",
      //     spend: "",
      //     airdropper: "",
      //     atomicSwap: "",
      //     passwordManager: "",
      //     raffler: "",
      //     trustedTimestamping: "",
      //     faas: "",
      //   },
      //   buy: {
      //     link:
      //       "https://koffeeswap.exchange/#/pro/KCS/0xeE00eF5a7EC4fDbD04eeE39d60Fe11C0DeD65e73",
      //     img: "img/koffeeswap.png",
      //     text: "KoffeeSwap",
      //   },
      // },
      {
        name: "Metis Andromeda",
        short_name: "metis",
        chain: "Metis",
        network: "mainnet",
        chain_id: 1088,
        network_id: 1,
        explorer_url: "https://andromeda-explorer.metis.io/",
        rpc_url: "https://andromeda.metis.io/?owner=1088",
        // blocks_per_day: 33200,
        native_currency: {
          symbol: "Metis",
          name: "Metis",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        logo: `img/metis.png`,
        contracts: {
          oklg: "0x000000000000000000000000000000000000dEaD",
          spend: "0xc8238E9f4c81e9B3fCCd2c5D7D93AeE9e147Fdf4",
          airdropper: "0xCb9c8e2F24Fe6C738342eFd30d0d3c4fF31a0613",
          atomicSwap: "0x32653a6a49f19cFD0478cf919c55E259b223C5E4",
          passwordManager: "0xcb4c29b0d3Ae389C01D6da44831F66FB1448aeaE",
          raffler: "0x5b9f3CDc2fA7130EEde7009900287Ba5074e22FA",
          trustedTimestamping: "0x7Eb0d5293a29eA83d0360E35A0DE2Ee04afDAFa0",
          faas: "0x5dBB9F64cd96E2DbBcA58d14863d615B67B42f2e",
          buybot: "",
        },
        // buy: {
        //   link: "https://koffeeswap.exchange/#/pro",
        //   img: "img/koffeeswap.png",
        //   text: "KoffeeSwap",
        // },
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
          oklg: "0x000000000000000000000000000000000000dEaD",
          spend: "0xd9b6F6e53c60802d278efE0C643D9C01BBd93abc",
          airdropper: "0xcC3c31a1FE9801A53604CD17c2b27fD68CABa528",
          atomicSwap: "0x17f54011cdb78772bcff6dde6e5e61e68894127a",
          passwordManager: "0xc8238E9f4c81e9B3fCCd2c5D7D93AeE9e147Fdf4",
          raffler: "0xCb9c8e2F24Fe6C738342eFd30d0d3c4fF31a0613",
          trustedTimestamping: "0x657bBa69DB9bf06D5BB2D0403867b41c08181630",
          faas: "0x23fe04798a2b84a40ba316060e174498af143607",
          buybot: "",
        },
        // buy: {
        //   link: "https://koffeeswap.exchange/#/pro",
        //   img: "img/koffeeswap.png",
        //   text: "KoffeeSwap",
        // },
      },
      // {
      //   name: "Binance Smart Chain Testnet",
      //   short_name: "bsctest",
      //   chain: "BSCT",
      //   network: "bsctest",
      //   chain_id: 97,
      //   network_id: 97,
      //   explorer_url: "https://testnet.bscscan.com",
      //   rpc_url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      //   blocks_per_day: 28800,
      //   native_currency: {
      //     symbol: "BNB",
      //     name: "BNB",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: "",
      //   },
      //   contracts: {
      //     oklg: "0x000000000000000000000000000000000000dEaD",
      //     spend: "",
      //     airdropper: "",
      //     atomicSwap: "",
      //     passwordManager: "",
      //     raffler: "",
      //     trustedTimestamping: "",
      //     faas: "",
      //   },
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
      // {
      //   name: "Ethereum Kovan",
      //   short_name: "kov",
      //   chain: "ETH",
      //   network: "kovan",
      //   chain_id: 42,
      //   network_id: 42,
      //   explorer_url: "https://kovan.etherscan.io",
      //   rpc_url: "https://kovan.infura.io/v3/%API_KEY%",
      //   native_currency: {
      //     symbol: "ETH",
      //     name: "Ethereum",
      //     decimals: "18",
      //     contractAddress: "",
      //     balance: "",
      //   },
      //   contracts: {
      //     oklg: "0x000000000000000000000000000000000000dEaD",
      //     spend: "0x16bf1B872E5ff4Bc157e98cf067F9F07e905ae3d",
      //     airdropper: "",
      //     atomicSwap: "",
      //     passwordManager: "",
      //     raffler: "",
      //     trustedTimestamping: "",
      //     faas: "",
      //   },
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
          oklg: "0x5f67df361f568e185aA0304A57bdE4b8028d059E",
          spend: "0x4AED49E5EB646b3298b05737Df86e69FC844e35C",
          airdropper: "0xD390AA35dbEf5e2f080bc9F919AB0ebBCf2aF59A",
          atomicSwap: "",
          passwordManager: "0x9a3399389a16547a2F5D407dE8428b81bFcd5E92",
          raffler: "0x4b0ABa75B46401018508b04a555aFCae15ea153E",
          trustedTimestamping: "0xC56cE130d777Ab65af4D037853508b461AAc357f",
          faas: "0x0d196CbC98Ff18E4178f260B995a7d5d9e1740cd",
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
