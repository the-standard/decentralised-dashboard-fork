export const abi = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_inToken",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "_outToken",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minOut",
        "type": "uint256"
      },
      {
        "internalType": "uint24",
        "name": "_fee",
        "type": "uint24"
      },
      {
        "internalType": "uint256",
        "name": "_deadline",
        "type": "uint256"
      }
    ],
    "name": "swap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "supplyLimit",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "type": "function",
    "name": "merklClaim",
    "inputs": [
        {
            "name": "_distributor",
            "type": "address",
            "internalType": "address"
        },
        {
            "name": "users",
            "type": "address[]",
            "internalType": "address[]"
        },
        {
            "name": "tokens",
            "type": "address[]",
            "internalType": "address[]"
        },
        {
            "name": "amounts",
            "type": "uint256[]",
            "internalType": "uint256[]"
        },
        {
            "name": "proofs",
            "type": "bytes32[][]",
            "internalType": "bytes32[][]"
        }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "undercollateralised",
    "inputs": [],
    "outputs": [
        {
            "name": "",
            "type": "bool",
            "internalType": "bool"
        }
    ],
    "stateMutability": "view"
  }
];

export default abi;
