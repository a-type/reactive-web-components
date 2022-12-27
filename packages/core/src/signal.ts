export interface Receiver<T> {
  (value: T): void | (() => void);
}

export interface Signal<T> {
  connect(receiver: Receiver<T>): () => void;
  disconnect(receiver: Receiver<T>): void;
  get(): T;
  set(value: T): void;
}

export type SignalValue<S extends Signal<any>> = S extends Signal<infer T>
  ? T
  : never;

export type SignalArrayValues<T extends Array<Signal<any>>> = {
  [K in keyof T]: SignalValue<T[K]>;
};

export type SignalTuple = [] | [Signal<any>, ...Signal<any>[]];

export function isSignal<T>(value: any): value is Signal<T> {
  return value && typeof value.connect === 'function';
}

export function signal<T>(initialValue: T): Signal<T> {
  const receivers = new Set<Receiver<T>>();
  const cleanups = new WeakMap<Receiver<T>, undefined | (() => void)>();
  let value = initialValue;
  function update(receiver: Receiver<T>, value: T) {
    return receiver(value) || undefined;
  }
  const signal: Signal<T> = {
    connect(receiver) {
      receivers.add(receiver);
      cleanups.set(receiver, update(receiver, value));
      return () => signal.disconnect(receiver);
    },
    disconnect(receiver) {
      receivers.delete(receiver);
      cleanups.delete(receiver);
    },
    get() {
      return value;
    },
    set(newValue: T) {
      value = newValue;
      for (const receiver of receivers) {
        cleanups.get(receiver)?.();
        cleanups.set(receiver, update(receiver, value));
      }
    },
  };
  return signal;
}

export function from<T>(
  subscribe: (cb: () => void) => () => void,
  getter: (previous?: T) => T,
) {
  const s = signal<T>(getter());

  subscribe(() => s.set(getter(s.get())));

  return s;
}
