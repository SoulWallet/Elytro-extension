import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from 'react';
interface IProps {
  open: boolean;
  handleOnOpenChange: () => void;
}

export default function AutoLockTimerModal({
  open,
  handleOnOpenChange,
}: IProps) {
  const timerOptions = [
    {
      label: '1 Minute',
      value: '1',
    },
    {
      label: '10 Minute',
      value: '10',
    },
    {
      label: '1 Hour',
      value: '60',
    },
    {
      label: '12 Hours',
      value: '720',
    },
    {
      label: '24 Hours',
      value: '1440',
    },
    {
      label: "Don't auto lock",
      value: '0',
    },
  ];
  const [selected, setSelected] = useState('0');
  const handleConfirm = () => {};
  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogContent className="h-screen">
        <DialogHeader>
          <DialogTitle>Auto lock timer</DialogTitle>
          <DialogDescription>
            <ToggleGroup
              type="single"
              className="flex-col gap-sm"
              value={selected}
              onValueChange={(value) => {
                setSelected(value || '0');
              }}
            >
              {timerOptions.map((option) => (
                <ToggleGroupItem
                  className="w-full p-0 flex-1"
                  value={option.value}
                  aria-label={option.label}
                  key={option.value}
                >
                  <div className="border p-lg rounded-md text-lg font-medium bg-white cursor-pointer flex items-center w-full bg-transparent">
                    {option.label}
                  </div>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex justify-between gap-lg">
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleOnOpenChange}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleConfirm}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
