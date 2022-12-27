import { signal, Signal } from './signal';

/**
 * A Slot is a Signal of a function that receives a value.
 * When the underlying function value changes, it will
 * re-evaluate the function with the latest value if it
 * is connected to one.
 */

export type Slot<T> = Signal<((value: T) => void | (() => void)) | undefined>;

export function createSlot<T>(callback?: (value: T) => void | (() => void)) {
  return signal(callback);
}
