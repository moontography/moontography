import Web3 from "web3";
import { AbiItem } from "web3-utils";

export default function KetherNFTLoaner(web3: Web3, contractAddy: string) {
  return new web3.eth.Contract(ketherNFTLoanerAbi, contractAddy);
}

const ketherNFTLoanerAbi: AbiItem[] = [
  {
    inputs: [
      { internalType: "address", name: "_ketherNFTAddress", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "idx", type: "uint256" },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "overridePerDayCharge",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "overrideMaxLoanDays",
        type: "uint256",
      },
    ],
    name: "AddPlot",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "idx", type: "uint256" },
      {
        indexed: false,
        internalType: "address",
        name: "loaner",
        type: "address",
      },
    ],
    name: "LoanPlot",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "idx", type: "uint256" },
    ],
    name: "RemovePlot",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "idx", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "idx", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "overridePerDayCharge",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "overrideMaxLoanDays",
        type: "uint256",
      },
    ],
    name: "UpdatePlot",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_idx", type: "uint256" },
      {
        internalType: "uint256",
        name: "_overridePerDayCharge",
        type: "uint256",
      },
      { internalType: "uint8", name: "_overrideMaxDays", type: "uint8" },
    ],
    name: "addPlot",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_idx", type: "uint256" }],
    name: "hasActiveLoan",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "loanChargePerDay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "loanPercentageCharge",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_idx", type: "uint256" },
      { internalType: "uint8", name: "_numDays", type: "uint8" },
      {
        components: [
          { internalType: "string", name: "link", type: "string" },
          { internalType: "string", name: "image", type: "string" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "bool", name: "NSFW", type: "bool" },
        ],
        internalType: "struct KetherNFTLoaner.PublishParams",
        name: "_publishParams",
        type: "tuple",
      },
    ],
    name: "loanPlot",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "loanServiceCharge",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "loans",
    outputs: [
      { internalType: "address", name: "loaner", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "end", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxLoanDurationDays",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "owners",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      {
        internalType: "uint256",
        name: "overrideLoanChargePerDay",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "overrideMaxLoanDurationDays",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_idx", type: "uint256" },
      {
        components: [
          { internalType: "string", name: "link", type: "string" },
          { internalType: "string", name: "image", type: "string" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "bool", name: "NSFW", type: "bool" },
        ],
        internalType: "struct KetherNFTLoaner.PublishParams",
        name: "_publishParams",
        type: "tuple",
      },
    ],
    name: "publish",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_idx", type: "uint256" }],
    name: "removePlot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amountWei", type: "uint256" }],
    name: "setLoanChargePerDay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "_percentage", type: "uint8" }],
    name: "setLoanPercentageCharge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amountWei", type: "uint256" }],
    name: "setLoanServiceCharge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "_numDays", type: "uint8" }],
    name: "setMaxLoanDurationDays",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_idx", type: "uint256" },
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_idx", type: "uint256" },
      {
        internalType: "uint256",
        name: "_overridePerDayCharge",
        type: "uint256",
      },
      { internalType: "uint8", name: "_overrideMaxDays", type: "uint8" },
    ],
    name: "updatePlot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
