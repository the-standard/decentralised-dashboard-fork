export const abi = [
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_compound",
        "type": "bool"
      }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dailyYield",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_EUROs",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "internalType": "struct Staking.Reward[]",
        "name": "_rewards",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tst",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_euros",
        "type": "uint256"
      }
    ],
    "name": "decreaseStake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tst",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_euros",
        "type": "uint256"
      }
    ],
    "name": "increaseStake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "positions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "start",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "TST",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "EUROs",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_holder",
        "type": "address"
      }
    ],
    "name": "projectedEarnings",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_EUROs",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "internalType": "struct Staking.Reward[]",
        "name": "_rewards",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export default abi;