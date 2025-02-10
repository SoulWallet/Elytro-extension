type SafeAny = any;
type TRecoveryInfo = {
  recoveryRecordID: string;
  status: number;
  newOwners: string[];
  guardianInfo: TGuardianInfo;
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
  signatureType: 0 | 1 | 2 | 3;
  updateTimestamp: string;
};

type TGuardianInfo = {
  threshold: number;
  salt: string;
  guardians: string[];
};
