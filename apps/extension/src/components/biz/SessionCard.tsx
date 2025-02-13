import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ELYTRO_SESSION_DATA } from '@/constants/session';
import { getHostname } from '@/utils/format';

interface ISessionCard {
  session?: TDAppInfo;
}

export default function SessionCard({
  session = ELYTRO_SESSION_DATA,
}: ISessionCard) {
  const { icon, name, url } = session;

  return (
    <div className="flex items-center justify-between rounded-sm">
      <span className="flex items-center gap-x-xs">
        <Avatar className="border border-gray-300 bg-white size-8 flex items-center justify-center">
          <AvatarImage src={icon} alt={`${name} logo`} className="size-5" />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <span className="elytro-text-bold-body">{name}</span>
      </span>

      <span className="elytro-text-smaller-bold-body text-gray-600">
        {getHostname(url)}
      </span>
    </div>
  );
}
