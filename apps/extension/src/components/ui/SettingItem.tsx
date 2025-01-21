import { Link } from 'wouter';

interface ISettingItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
}

const SettingItem = ({ icon: Icon, label, path }: ISettingItemProps) => (
  <Link
    href={path}
    className="elytro-rounded-border-item-wrapper flex items-center hover:bg-gray-150"
  >
    <Icon className="mr-3" />
    {label}
  </Link>
);

export default SettingItem;
