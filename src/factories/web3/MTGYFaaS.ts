import Web3 from "web3";
import { AbiItem } from "web3-utils";

export default function MTGYFaaS(web3: Web3, contractAddy: string) {
  return new web3.eth.Contract(mtgyFaasAbi, contractAddy);
}

const mtgyFaasAbi: AbiItem[] = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_mtgyAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_mtgySpendAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newCost",
        type: "uint256",
      },
    ],
    name: "changeServiceCost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddy",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_supply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_perBlockAllocation",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_lockedUntilDate",
        type: "uint256",
      },
    ],
    name: "createNewTokenContract",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "mtgyServiceCost",
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
    name: "mtgySpendContract",
    outputs: [
      {
        internalType: "contract MTGYSpend",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mtgyToken",
    outputs: [
      {
        internalType: "contract MTGY",
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
        internalType: "address",
        name: "_faasTokenAddy",
        type: "address",
      },
    ],
    name: "removeTokenContract",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokensUpForStaking",
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
