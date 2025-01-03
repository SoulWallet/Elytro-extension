export class SubscribableStore<T> {
  protected _state: T;
  protected _subscribers: Set<(state: Readonly<T>) => void> = new Set();

  constructor(initialState: T) {
    this._state = initialState;
  }

  public get state(): Readonly<T> {
    return { ...this._state };
  }

  public setState(newState: Partial<T>): void {
    const hasChanges = Object.keys(newState).some(
      (key) => this._state[key as keyof T] !== newState[key as keyof T]
    );

    if (hasChanges) {
      this._state = { ...this._state, ...newState };
      this._notifySubscribers();
    }
  }

  public resetState() {
    this._subscribers.clear();
    this._state = {} as T;
  }

  protected _notifySubscribers(): void {
    this._subscribers.forEach((subscriber) => subscriber(this._state));
  }

  public subscribe(subscriber: (state: Readonly<T>) => void): () => void {
    this._subscribers.add(subscriber);

    return () => {
      this._subscribers.delete(subscriber);
    };
  }

  public unsubscribe(subscriber: (state: Readonly<T>) => void): void {
    this._subscribers.delete(subscriber);
  }
}
