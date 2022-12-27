import { SignalArrayValues, SignalTuple } from './signal';

type EffectCallback<T extends SignalTuple> = (
  ...values: SignalArrayValues<T>
) => void | (() => void);

export function effect<T extends SignalTuple>(
  callback: EffectCallback<T>,
  dependencies: T,
) {
  let cleanup: (() => void) | void = undefined;
  function update() {
    cleanup?.();
    cleanup = callback(...(dependencies.map((signal) => signal.get()) as any));
  }
  const dependencyCleanups = dependencies.map((signal) =>
    signal.connect(update),
  );
  update();
  return () => {
    cleanup?.();
    dependencyCleanups.forEach((cleanup) => cleanup());
  };
}
