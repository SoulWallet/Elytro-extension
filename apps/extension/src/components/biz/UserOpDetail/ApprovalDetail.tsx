import { DecodeResult } from '@soulwallet/decoder';
import SessionCard from '../SessionCard';
import InfoCard from '../InfoCard';
import TokenAmountItem from '../TokenAmountItem';
import FragmentedAddress from '../FragmentedAddress';
import { getTransferredTokenInfo } from '@/utils/dataProcess';

const { InfoCardItem, InfoCardList } = InfoCard;

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
      <InfoCardList>
        <InfoCardItem
          label="Sending"
          content={<TokenAmountItem {...transferredTokenInfo} size="sm" />}
        />

        <InfoCardItem
          label="Contract"
          content={
            <FragmentedAddress
              address={decodedUserOp?.to}
              chainId={decodedUserOp?.toInfo?.chainId}
              showChainIcon={false}
            />
          }
        />

        <InfoCardItem
          label="Function"
          content={
            decodedUserOp?.method?.text || (
              <span className="elytro-text-tiny-body bg-white px-xs py-3xs rounded-xs text-gray-750">
                Unknown
              </span>
            )
          }
        />

        <InfoCardItem label="Data" content={decodedUserOp?.method?.bytes4} />
      </InfoCardList>
    </>
  );
}
