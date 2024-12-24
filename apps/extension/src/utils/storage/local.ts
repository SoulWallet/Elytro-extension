import { formatStringifiedObject } from '../format';

/**
 * Elytro Local Storage
 */
const localStorage: StorageOperations = {
  // TODO: add parse/stringify
  save: async <T>(items: Record<string, T>): Promise<void> => {
    try {
      await chrome.storage.local.set(items);
    } catch (error) {
      throw new Error(
        `Elytro::LocalStorage::save: ${(error as Error).message}`
      );
    }
  },

  get: async <T>(keys: string[] | string): Promise<T | Record<string, T>> => {
    const isString = typeof keys === 'string';

    try {
      const res = await chrome.storage.local.get(keys);
      return formatStringifiedObject(isString ? res[keys] : res);
    } catch (error) {
      throw new Error(`Elytro::LocalStorage::get: ${(error as Error).message}`);
    }
  },

  remove: async (keys: string[]): Promise<void> => {
    try {
      await chrome.storage.local.remove(keys);
    } catch (error) {
      throw new Error(
        `Elytro::LocalStorage::remove: ${(error as Error).message}`
      );
    }
  },

  clear: async (): Promise<void> => {
    try {
      await chrome.storage.local.clear();
    } catch (error) {
      throw new Error(
        `Elytro::LocalStorage::clear: ${(error as Error).message}`
      );
    }
  },
};

export { localStorage };
