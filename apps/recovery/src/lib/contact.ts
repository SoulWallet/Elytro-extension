export const isContactSigned = (
  signatures: TGuardianSignature[],
  address: string
) => {
  return signatures?.some(
    ({ guardian }) => guardian === address?.toLowerCase()
  );
};
