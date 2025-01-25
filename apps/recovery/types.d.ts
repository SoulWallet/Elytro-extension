type SafeAny = any;
type TRecoveryInfo = {
  recoveryRecordID: string;
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
  guardianSignatures: TGuardianSignature[];
};

type TGuardianSignature = {
  guardian: string;
  guardianSignature: string;
  recoveryRecordID: string;
  signatureType: number;
  updateTimestamp: string;
};
