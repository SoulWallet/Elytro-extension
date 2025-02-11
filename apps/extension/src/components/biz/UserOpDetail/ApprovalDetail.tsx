import { DecodeResult } from '@soulwallet/decoder';
import SessionCard from '../SessionCard';
import InfoCard from '../InfoCard';
import TokenAmountItem from '../TokenAmountItem';
import FragmentedAddress from '../FragmentedAddress';
import { getTransferredTokenInfo } from '@/utils/dataProcess';

const { InfoCardItem, InfoCardWrapper } = InfoCard;

interface IApprovalDetailProps {
  session?: TDAppInfo;
  decodedUserOp: Nullable<DecodeResult>;
}

export default function ApprovalDetail({
  session,
  decodedUserOp,
}: IApprovalDetailProps) {
  if (!decodedUserOp) {
    return null;
  }

  const transferredTokenInfo = getTransferredTokenInfo(decodedUserOp);

  return (
    <>
      <SessionCard session={session} />
      <InfoCard.InfoCardWrapper>
        <div className="flex flex-col gap-y-sm">
          <InfoCardWrapper>
            <InfoCardItem
              label="Sending"
              content={<TokenAmountItem {...transferredTokenInfo} />}
            />

            <InfoCardItem
              label="Token"
              content={decodedUserOp?.toInfo?.symbol}
            />

            <InfoCardItem
              label="Contract"
              content={
                <FragmentedAddress
                  address={decodedUserOp?.to}
                  chainId={decodedUserOp?.toInfo?.chainId}
                />
              }
            />

            <InfoCardItem
              label="Function"
              content={decodedUserOp?.method?.text || 'Unknown'}
            />

            {/* TODO: get raw data */}
            <InfoCardItem
              label="Raw data"
              content={decodedUserOp?.method?.bytes4}
            />
          </InfoCardWrapper>
        </div>
      </InfoCard.InfoCardWrapper>
    </>
  );
}
