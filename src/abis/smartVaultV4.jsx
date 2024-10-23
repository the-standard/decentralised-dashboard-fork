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
  }
];

export default abi;
