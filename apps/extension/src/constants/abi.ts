export const ABI_RECOVERY_INFO_RECORDER = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'category',
        type: 'bytes32',
      },
      { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'DataRecorded',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'category', type: 'bytes32' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'recordData',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
