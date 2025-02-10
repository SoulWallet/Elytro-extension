import { gql } from '@apollo/client';

export const QUERY_GET_RECOVERY_INFO = gql`
  query GetRecoveryInfo($recoveryRecordId: String!) {
    getRecoveryInfo(recoveryRecordID: $recoveryRecordId) {
      recoveryRecordID
      onchainID
      address
      chainID
      createTimestamp
      nonce
      newOwners
      guardianInfo {
        salt
        threshold
        guardians
      }
      status
      guardianSignatures {
        recoveryRecordID
        guardian
        signatureType
        guardianSignature
        updateTimestamp
      }
      validTime
      emailGuardianStatus
    }
  }
`;

export const MUTATION_ADD_CONTACT_SIGNATURE = gql`
  mutation AddGuardianSignature($input: GuardianSignatureInput!) {
    addGuardianSignature(input: $input) {
      recoveryRecordID
      guardian
      signatureType
      guardianSignature
      updateTimestamp
    }
  }
`;
