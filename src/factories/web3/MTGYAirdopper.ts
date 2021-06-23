import Web3 from "web3";
import { AbiItem } from "web3-utils";

export default function MTGYAirdropper(web3: Web3, contractAddy: string) {
  return new web3.eth.Contract(mtgyBtsAbi, contractAddy);
}

const mtgyBtsAbi: AbiItem[] = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_mtgyTokenAddy",
        type: "address",
      },
      {
        internalType: "address",
        name: "_mtgySpendAddy",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_totalAmount",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "userAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToReceive",
            type: "uint256",
          },
        ],
        internalType: "struct MTGYAirdropper.Receiver[]",
        name: "_addressesAndAmounts",
        type: "tuple[]",
      },
    ],
    name: "bulkSendTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_spendAddy",
        type: "address",
      },
    ],
    name: "changeMtgySpendAddy",
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
    ],
    name: "changeMtgyTokenAddy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newCost",
        type: "uint256",
      },
    ],
    name: "changeServiceCost",
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
    name: "mtgySpendAddy",
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
    name: "mtgyTokenAddy",
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
