import React from 'react';
import TabLayout from '../components/TabLayout';
import { SOCIAL_MEDIA_LINKS } from '@/constants/social-media';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { TAB_ROUTE_PATHS } from '../routes';
import { navigateTo } from '@/utils/navigation';
import Slogan from '@/components/Slogan';

const SocialMediaIcon: React.FC<{
  name: string;
  url: string;
  icon: string;
}> = ({ name, url, icon }) => {
  return (
    <a key={name} href={url} target="_blank" rel="noreferrer">
      <img src={icon} alt={name} className="w-6 h-6" />
    </a>
  );
};

const handleInit = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (tabId) {
      chrome.sidePanel.open({
        tabId,
      });
    }
  });
};

const Launch: React.FC = () => {
  return (
    <TabLayout
      footer={
        <>
          {SOCIAL_MEDIA_LINKS.map(({ name, url, icon }) => (
            <SocialMediaIcon key={name} name={name} url={url} icon={icon} />
          ))}
        </>
      }
    >
      <div className="p-6 text-gray-900 min-w-max">
        <Slogan />
        <p className="mt-6 opacity-60 text-lg">
          Setup up new account to receive 10 USDC
        </p>

        <div className="mt-10">
          <Button
            className="rounded-full w-full px-4 py-5 h-14 mb-4 font-medium text-lg leading-6"
            onClick={() => {
              // TODO: Maintain two ways to launch temporarily. Delete the later one after side panel launch is implemented
              // 1. tab launch must be reserved cause side panel cannot be opened when ext is installed
              handleInit();
              // 2. remove this after side panel launch is implemented
              navigateTo('tab', TAB_ROUTE_PATHS.Create);
            }}
          >
            Create wallet for free
          </Button>
          <p className="text-center elytro-text-small-body text-gray-750">
            Used to have an account?{' '}
            <Link href={TAB_ROUTE_PATHS.Recover}>Recover here</Link>
          </p>
        </div>
      </div>
    </TabLayout>
  );
};

export default Launch;
