'use client';

import React, { useState } from 'react';
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';

import { X } from 'lucide-react';
import AddressWithChain from './AddressWithChain';

export default function ConnectControl() {
  const [showDialog, setShowDialog] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = (connector: Connector) => {
    connect({ connector });
    setShowDialog(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDialog(false);
  };

  const onDialogOpenChange = (open: boolean) => {
    if (isConnected) {
      setShowDialog(false);
    } else {
      setShowDialog(open);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        {isConnected ? (
          <div className="flex items-center gap-2 py-sm px-md rounded-2xs bg-white bg-white">
            <AddressWithChain
              address={address}
              chainID={chain?.id}
              className="px-0 py-0 p-0"
            />
            <div className="h-4 w-[1px] bg-gray-300" />
            <X
              onClick={handleDisconnect}
              color="gray"
              className="cursor-pointer hover:shadow-md"
            />
          </div>
        ) : (
          <Button
            className="rounded-full bg-transparent hover:bg-transparent shadow-none hover:shadow-md text-dark-blue border border-gray-450"
            onClick={() => setShowDialog(true)}
          >
            Connect Wallet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select an account client</DialogTitle>
        </DialogHeader>

        {connectors.map((connector, index) => (
          <div
            key={index}
            onClick={() => handleConnect(connector)}
            className="rounded-md p-2 flex items-center gap-2 bg-gray-150 hover:bg-gray-300"
          >
            <Image
              src={
                connector?.icon ||
                `https://placehold.co/24x24?text=${connector.name}`
              }
              alt={connector.name}
              className="rounded-full size-6"
              width={24}
              height={24}
            />
            <span>Connect with {connector.name}</span>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}
