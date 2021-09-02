import Web3 from "web3";
import { AbiItem } from "web3-utils";

export default function KetherHomepage(web3: Web3, contractAddy: string) {
  return new web3.eth.Contract(ketherAbi, contractAddy);
}

const ketherAbi: AbiItem[] = [
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "ads",
    outputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "x",
        type: "uint256",
      },
      {
        name: "y",
        type: "uint256",
      },
      {
        name: "width",
        type: "uint256",
      },
      {
        name: "height",
        type: "uint256",
      },
      {
        name: "link",
        type: "string",
      },
      {
        name: "image",
        type: "string",
      },
      {
        name: "title",
        type: "string",
      },
      {
        name: "NSFW",
        type: "bool",
      },
      {
        name: "forceNSFW",
        type: "bool",
      },
    ],
    payable: false,
    type: "function",
    stateMutability: "view",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_x",
        type: "uint256",
      },
      {
        name: "_y",
        type: "uint256",
      },
      {
        name: "_width",
        type: "uint256",
      },
      {
        name: "_height",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [
      {
        name: "idx",
        type: "uint256",
      },
    ],
    payable: true,
    type: "function",
    stateMutability: "payable",
  },
  {
    constant: true,
    inputs: [],
    name: "pixelsPerCell",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    type: "function",
    stateMutability: "view",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "grid",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    type: "function",
    stateMutability: "view",
  },
  {
    constant: false,
    inputs: [],
    name: "withdraw",
    outputs: [],
    payable: false,
    type: "function",
    stateMutability: "nonpayable",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_idx",
        type: "uint256",
      },
      {
        name: "_link",
        type: "string",
      },
      {
        name: "_image",
        type: "string",
      },
      {
        name: "_title",
        type: "string",
      },
      {
        name: "_NSFW",
        type: "bool",
      },
    ],
    name: "publish",
    outputs: [],
    payable: false,
    type: "function",
    stateMutability: "nonpayable",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_idx",
        type: "uint256",
      },
      {
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "setAdOwner",
    outputs: [],
    payable: false,
    type: "function",
    stateMutability: "nonpayable",
  },
  {
    constant: true,
    inputs: [],
    name: "getAdsLength",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    type: "function",
    stateMutability: "view",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_idx",
        type: "uint256",
      },
      {
        name: "_NSFW",
        type: "bool",
      },
    ],
    name: "forceNSFW",
    outputs: [],
    payable: false,
    type: "function",
    stateMutability: "nonpayable",
  },
  {
    constant: true,
    inputs: [],
    name: "weiPixelPrice",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    type: "function",
    stateMutability: "view",
  },
  {
    inputs: [
      {
        name: "_contractOwner",
        type: "address",
      },
      {
        name: "_withdrawWallet",
        type: "address",
      },
    ],
    payable: false,
    type: "constructor",
    stateMutability: "nonpayable",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "idx",
        type: "uint256",
      },
      {
        indexed: false,
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        name: "x",
        type: "uint256",
      },
      {
        indexed: false,
        name: "y",
        type: "uint256",
      },
      {
        indexed: false,
        name: "width",
        type: "uint256",
      },
      {
        indexed: false,
        name: "height",
        type: "uint256",
      },
    ],
    name: "Buy",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "idx",
        type: "uint256",
      },
      {
        indexed: false,
        name: "link",
        type: "string",
      },
      {
        indexed: false,
        name: "image",
        type: "string",
      },
      {
        indexed: false,
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        name: "NSFW",
        type: "bool",
      },
    ],
    name: "Publish",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "idx",
        type: "uint256",
      },
      {
        indexed: false,
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        name: "to",
        type: "address",
      },
    ],
    name: "SetAdOwner",
    type: "event",
  },
];
