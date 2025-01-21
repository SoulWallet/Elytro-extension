import { cn } from '@/utils/shadcn/utils';

interface IHelperTextProps {
  title: string;
  description: string;
  className?: string;
}

export default function HelperText({
  title,
  description,
  className,
}: IHelperTextProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-sm bg-purple py-md px-lg text-gray-750',
        className
      )}
    >
      <h2 className="elytro-text-small-bold ">{title}</h2>
      <p className="elytro-text-tiny-body mt-2xs">{description}</p>
    </div>
  );
}
