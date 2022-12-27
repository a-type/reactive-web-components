import { effect } from './effect';
import { Signal } from './signal';
import { Slot } from './slot';

export function connect<T>(signal: Signal<T>, slot: Slot<T>) {
  return effect(
    (cb, value) => {
      return cb?.(value);
    },
    [slot, signal],
  );
}
