import { effect } from './effect';
import { signal, Signal, SignalTuple, SignalArrayValues } from './signal';

export function transform<I extends SignalTuple, O>(
  callback: (...values: SignalArrayValues<I>) => O,
  ...inputs: I
): Signal<O> {
  const output = signal(callback(...(inputs.map((s) => s.get()) as any)));
  effect((...inputValues) => {
    output.set(callback(...inputValues));
  }, inputs);
  return output;
}
