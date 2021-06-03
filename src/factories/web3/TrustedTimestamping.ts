import Web3 from "web3";
import { AbiItem } from "web3-utils";

export default function TrustedTimestamping(web3: Web3, contractAddy: string) {
  return new web3.eth.Contract(timestampingContractAbi, contractAddy);
}

const timestampingContractAbi: AbiItem[] = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newCost",
        type: "uint256",
      },
    ],
    name: "changeCost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "dataHash",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "fileName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "fileSizeBytes",
        type: "uint256",
      },
    ],
    name: "storeHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "mtgyAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "mtgySpendAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "dataHash",
        type: "bytes32",
      },
    ],
    name: "StoreHash",
    type: "event",
  },
  {
    inputs: [],
    name: "cost",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "creator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "dataHash",
        type: "bytes32",
      },
    ],
    name: "getAddressesFromHash",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "addy",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "time",
            type: "uint256",
          },
        ],
        internalType: "struct TrustedTimestamping.Address[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addy",
        type: "address",
      },
    ],
    name: "getHashesFromAddress",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "dataHash",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "time",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "fileName",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "fileSizeBytes",
            type: "uint256",
          },
        ],
        internalType: "struct TrustedTimestamping.DataHash[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "spendAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
