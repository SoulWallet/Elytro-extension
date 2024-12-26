type StorageOperations = {
  save: <T>(items: Record<string, T>) => Promise<void>;
  get: <T>(keys: string[] | string) => Promise<T | Record<string, T>>;
  remove: (keys: string[]) => Promise<void>;
  clear: () => Promise<void>;
};
