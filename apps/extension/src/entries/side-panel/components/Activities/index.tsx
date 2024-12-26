import EmptyTip from '@/components/EmptyTip';
import { useAccount } from '../../contexts/account-context';
import ActivityGroup from './Group';
import { UserOperationHistory } from '@/constants/operations';

export default function Activities() {
  const { history } = useAccount();

  if (!history.length)
    return (
      <div className="flex min-h-[50vh] items-center">
        <EmptyTip tip="You don’t have any activities yet" />
      </div>
    );

  // split histories into days
  const historiesByDay = history.reduce(
    (acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString();
      acc[date] = acc[date] || [];
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, UserOperationHistory[]>
  );

  return (
    <div className="flex flex-col overflow-auto px-lg gap-y-lg">
      {Object.entries(historiesByDay).map(([date, items]) => (
        <ActivityGroup key={date} date={date} items={items} />
      ))}
    </div>
  );
}
