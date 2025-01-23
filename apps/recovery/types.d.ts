type SafeAny = any;
type TRecoveryInfo = {
  status: number;
  newOwners: string[];
  guardianInfo: {
    threshold: number;
    salt: string;
    guardians: string[];
  };
  validTime: number;
  chainID: string;
  address: string;
  nonce: number;
  onchainID: string;
  createTimestamp: number;
};
