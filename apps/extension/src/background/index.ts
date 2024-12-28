import { RUNTIME_MESSAGE_TYPE } from '@/constants/message';
import { sendReadyMessageToTabs } from './utils';
import { PortMessageManager } from '@/utils/message/portMessageManager';
import { walletController, WalletController } from './walletController';
import connectionManager from '@/background/services/connection';
import rpcFlow, { TProviderRequest } from '@/background/provider/rpcFlow';
import { getDAppInfoFromSender } from '@/utils/url';
import sessionManager from './services/session';
import keyring from './services/keyring';
import eventBus from '@/utils/eventBus';
import RuntimeMessage from '@/utils/message/runtimeMessage';
import { EVENT_TYPES } from '@/constants/events';
import uiReqCacheManager from '@/utils/cache/uiReqCacheManager';
import { rpcCacheManager } from '@/utils/cache/rpcCacheManager';
import accountManager from './services/account';
import { ElytroMessageTypeEn } from '@/utils/message/duplexStream';

chrome.runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    case chrome.runtime.OnInstalledReason.INSTALL:
      // wait for 200ms to ensure the page is ready
      setTimeout(() => {
        chrome.tabs.create({
          url: chrome.runtime.getURL(`src/entries/tab/index.html#/launch`),
        });
      }, 200);
      break;
    // case chrome.runtime.OnInstalledReason.UPDATE:
    //   // TODO: do something
    //   break;
    // case chrome.runtime.OnInstalledReason.CHROME_UPDATE:
    //   // TODO: do something
    //   break;
    // case chrome.runtime.OnInstalledReason.SHARED_MODULE_UPDATE:
    //   // TODO: do something
    //   break;
  }
});

// allow side panel to open when clicking the extension icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

const initApp = async () => {
  // await keyring.restore();
  await connectionManager.restore();
  await sendReadyMessageToTabs();

  rpcCacheManager.init();

  // TODO: replace with RuntimeMessage
  chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    if (msg.type === RUNTIME_MESSAGE_TYPE.DOM_READY) {
      sendResponse(true);
    }
  });
};

initApp();

const providerPortManager = new PortMessageManager('elytro-cs');

/**
 * Init the message between background and (content script / page provider)
 * @param port
 */
const initContentScriptAndPageProviderMessage = (port: chrome.runtime.Port) => {
  const tabId = port.sender?.tab?.id;
  const origin = port.sender?.origin;
  if (!port.sender || !origin || !tabId) {
    return;
  }

  providerPortManager.connect(port);

  port.onDisconnect.addListener(() => {
    sessionManager.removeSession(tabId, origin);
  });

  providerPortManager.onMessage('NEW_PAGE_LOADED', async () => {
    sessionManager.createSession(tabId, origin, providerPortManager);

    if (connectionManager.isConnected(origin)) {
      await keyring.tryUnlock();

      // wait 500ms to ensure the session is ready
      setTimeout(() => {
        sessionManager.broadcastMessageToDApp(
          origin,
          'accountsChanged',
          accountManager?.currentAccount?.address
            ? [accountManager.currentAccount.address]
            : []
        );
      }, 500);
    }
  });

  providerPortManager.onMessage(
    'CONTENT_SCRIPT_REQUEST',
    async (
      { uuid, payload }: { uuid: string; payload: RequestArguments },
      port
    ) => {
      const tabId = port.sender?.tab?.id;

      if (!tabId || !port.sender?.origin) {
        return;
      }

      sessionManager.createSession(
        tabId,
        port.sender.origin,
        providerPortManager
      );

      const dAppInfo = await getDAppInfoFromSender(port.sender!);
      const providerReq: TProviderRequest = {
        rpcReq: payload,
        dApp: dAppInfo,
      };

      try {
        const result = await rpcFlow(providerReq);

        providerPortManager.sendMessage(
          ElytroMessageTypeEn.RESPONSE_TO_CONTENT_SCRIPT,
          {
            method: payload.method,
            data: result,
            uuid,
          },
          port.sender?.origin
        );
      } catch (error) {
        console.error('Elytro: dApp request encountered error', error);
      }
    }
  );
};

type TUIRequest = {
  method: keyof WalletController;
  params: unknown[];
};

const initUIMessage = (port: chrome.runtime.Port) => {
  const UIPortManager = new PortMessageManager('elytro-ui');
  UIPortManager.connect(port);

  // WalletController handles UI request
  async function handleUIRequest(request: TUIRequest) {
    const { method, params } = request;

    if (typeof walletController[method] === 'function') {
      const res = await (
        walletController[method] as (...args: unknown[]) => unknown
      )(...params);

      uiReqCacheManager.set(method, params, res);
      return res;
    }

    throw new Error(`Method ${method} not found on ElytroWalletClient`);
  }

  async function handleUIRequestWithCache({ method, params }: TUIRequest) {
    const cache = uiReqCacheManager.get(method, params);
    if (cache) {
      handleUIRequest({ method, params });
      return cache;
    } else {
      return await handleUIRequest({ method, params });
    }
  }

  // Wallet Requests
  UIPortManager.onMessage('UI_REQUEST', async (data, port) => {
    const msgKey = `UI_RESPONSE_${data.method}`;
    try {
      const result = await handleUIRequestWithCache(data as TUIRequest);

      UIPortManager.sendMessage(msgKey, { result }, port.sender?.origin);
    } catch (error) {
      UIPortManager.sendMessage(
        msgKey,
        { error: (error as Error).message },
        port.sender?.origin
      );
    }
  });
};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'elytro-ui') {
    initUIMessage(port);
    return;
  }

  if (port.name === 'elytro-cs') {
    initContentScriptAndPageProviderMessage(port);
    return;
  }
});

const initBackgroundMessage = () => {
  /** History */
  eventBus.on(EVENT_TYPES.HISTORY.ITEMS_UPDATED, () => {
    RuntimeMessage.sendMessage(EVENT_TYPES.HISTORY.ITEMS_UPDATED);
  });

  eventBus.on(EVENT_TYPES.HISTORY.ITEM_STATUS_UPDATED, (userOpHash, status) => {
    RuntimeMessage.sendMessage(
      `${EVENT_TYPES.HISTORY.ITEM_STATUS_UPDATED}_${userOpHash}`,
      {
        status,
      }
    );
  });

  // /** Approval */
  // eventBus.on(EVENT_TYPES.APPROVAL.REQUESTED, (approvalId) => {
  //   RuntimeMessage.sendMessage(EVENT_TYPES.APPROVAL.REQUESTED, { approvalId });
  // });
};

initBackgroundMessage();
