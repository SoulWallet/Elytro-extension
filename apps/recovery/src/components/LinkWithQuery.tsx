import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ILinkWithIDProps {
  href: string;
  children: React.ReactNode;
}

const LinkWithQuery = ({ href, children }: ILinkWithIDProps) => {
  const id = useSearchParams().get('id');

  const newHref = id ? `${href}?id=${id}` : href;

  return <Link href={newHref}>{children}</Link>;
};

export default LinkWithQuery;
