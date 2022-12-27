import { effect } from './effect';
import { Signal } from './signal';
import { transform } from './transforms';

export function template(
  strings: TemplateStringsArray,
  ...values: [Signal<string>, ...Signal<string>[]]
): Signal<string> {
  return transform((...values) => {
    let result = strings[0];
    for (let i = 0; i < values.length; i++) {
      result += values[i];
      result += strings[i + 1];
    }
    return result;
  }, ...values);
}
