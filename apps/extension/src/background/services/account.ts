import { elytroSDK } from './sdk';
import { EVENT_TYPES } from '@/constants/events';
import eventBus from '@/utils/eventBus';
import LocalSubscribableStore from '@/utils/store/LocalSubscribableStore';

type TAccountsState = {
  accounts: TAccountInfo[];
  currentAccount: TAccountInfo | null;
};

const ACCOUNTS_STORAGE_KEY = 'elytroAccounts';

class AccountManager {
  private _store: LocalSubscribableStore<TAccountsState>;

  constructor() {
    this._store = new LocalSubscribableStore<TAccountsState>(
      ACCOUNTS_STORAGE_KEY,
      (initState) => {
        if (initState?.currentAccount) {
          eventBus.emit(
            EVENT_TYPES.ACCOUNT.ACCOUNT_INITIALIZED,
            initState.currentAccount
          );
        }
      }
    );
  }

  private get _accounts() {
    return this._store.state.accounts || [];
  }

  private set _accounts(accounts: TAccountInfo[]) {
    this._store.state.accounts = accounts;
  }

  private get _currentAccount() {
    return this._store.state.currentAccount;
  }

  private set _currentAccount(currentAccount: TAccountInfo | null) {
    this._store.state.currentAccount = currentAccount;
  }

  // TODO: maybe make _accounts public?
  get accounts() {
    return this._accounts;
  }

  get currentAccount() {
    return this._currentAccount;
  }

  public getAccountByChainId(chainId: number | string) {
    return this._accounts.find(
      (account) => account.chainId === Number(chainId)
    );
  }

  public async createAccountAsCurrent(eoaAddress: string, chainId: number) {
    const account = this.getAccountByChainId(chainId);

    if (account) {
      console.log(
        'Elytro::AccountManager::createAccount: account already exists'
      );
      // return account;
      return;
    }

    try {
      // creating address is not a sdk chain related request, so we don't rely on switch chain
      const newAccountAddress = await elytroSDK.createWalletAddress(
        eoaAddress,
        chainId
      );

      const newAccount = {
        address: newAccountAddress,
        chainId,
        isDeployed: false,
        hasRecoveryContacts: false,
      };

      // ! push method will not trigger state update, so we need to reset the array
      this._accounts = [...this._accounts, newAccount];
      this._currentAccount = newAccount;
    } catch (error) {
      console.error(error);
    }
  }

  public async switchAccountByChainId(chainId: number) {
    const account = this.getAccountByChainId(chainId);

    if (!account) {
      throw new Error(
        'Elytro::AccountManager::switchAccountByChainId: account not found'
      );
    }

    this._currentAccount = account;
  }

  public activateCurrentAccount() {
    if (!this._currentAccount) {
      throw new Error(
        'Elytro::AccountManager::activateCurrentAccount: current account not found'
      );
    }

    const updatedAccount = {
      ...this._currentAccount,
      isDeployed: true,
    };

    this._accounts = this._accounts.map((account) =>
      account.address === updatedAccount.address ? updatedAccount : account
    );

    this._currentAccount = updatedAccount;
  }

  public async resetAccounts() {
    this._accounts = [];
    this._currentAccount = null;
  }

  public async removeAccountByAddress(address: string) {
    this._accounts = this._accounts.filter(
      (account) => account.address !== address
    );
  }

  public async updateCurrentAccountInfo(account: Partial<TAccountInfo>) {
    if (!this._currentAccount) return;

    const updatedAccount = {
      ...this._currentAccount,
      ...account,
    };

    this._accounts = this._accounts.map((acc) =>
      acc.address === updatedAccount.address ? updatedAccount : acc
    );

    this._currentAccount = updatedAccount;
  }
}

const accountManager = new AccountManager();
export default accountManager;
