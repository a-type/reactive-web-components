import { from } from './signal.js';

export function interval(ms: number) {
  return from(
    (cb) => {
      const handle = setInterval(cb, ms);
      return () => {
        clearInterval(handle);
      };
    },
    (previous: number = -1) => previous + 1,
  );
}
