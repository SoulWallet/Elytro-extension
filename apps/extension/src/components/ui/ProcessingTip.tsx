import { cn } from '@/utils/shadcn/utils';
import { LoaderCircle } from 'lucide-react';

interface IProcessingTipProps {
  body?: string;
  subBody?: string;
  className?: string;
}

const ProcessingTip = ({
  body = 'Preparing & calculating',
  subBody = 'This may take up to 15 seconds',
  className,
}: IProcessingTipProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center gap-y-sm py-lg',
      className
    )}
  >
    <div className="bg-blue rounded-pill p-md">
      <LoaderCircle
        className="size-12 animate-spin"
        stroke="#fff"
        strokeOpacity={0.9}
      />
    </div>
    <div className="elytro-text-body-bold">{body}</div>
    <div className="elytro-text-tiny-body text-gray-600">{subBody}</div>
  </div>
);

export default ProcessingTip;
