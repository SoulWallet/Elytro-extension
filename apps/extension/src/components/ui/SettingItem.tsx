import { Link } from 'wouter';

interface ISettingItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
}

const SettingItem = ({ icon: Icon, label, path }: ISettingItemProps) => (
  <Link
    href={path}
    className="elytro-rounded-border-item-wrapper flex items-center"
  >
    <Icon />
    <span className="ml-sm">{label}</span>
  </Link>
);

export default SettingItem;
