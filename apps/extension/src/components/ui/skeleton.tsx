import { cn } from '@/utils/shadcn/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xs bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };
