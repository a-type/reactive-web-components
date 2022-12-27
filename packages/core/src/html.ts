import { effect } from './effect';
import { signal, Signal } from './signal';
import { createSlot, Slot } from './slot';

export type ElementSignal = Signal<Element | undefined>;

export function makeAttributeSlot(
  element: ElementSignal,
  name: string,
): Slot<string | undefined> {
  const slot = createSlot<string | undefined>();
  effect(
    (elementValue) => {
      slot.set((value: string | undefined) => {
        if (value !== undefined) {
          elementValue?.setAttribute(name, value.toString());
        } else {
          elementValue?.removeAttribute(name);
        }
      });
    },
    [element],
  );
  return slot;
}

export function makeEventSlot(
  element: ElementSignal,
  name: string,
): Slot<((event: Event) => void) | undefined> {
  const slot = createSlot<((event: Event) => void) | undefined>();
  effect(
    (elementValue) => {
      slot.set((value: ((event: Event) => void) | undefined) => {
        if (value) {
          elementValue?.addEventListener(name, value);
          return () => {
            elementValue?.removeEventListener(name, value);
          };
        }
      });
    },
    [element],
  );
  return slot;
}

export function makeTextContentSlot(
  element: ElementSignal,
): Slot<string | undefined> {
  const slot = createSlot<string | undefined>();
  effect(
    (elementValue) => {
      slot.set((value: string | undefined) => {
        if (elementValue) {
          if (value !== undefined) {
            elementValue.textContent = value.toString();
          } else {
            elementValue.textContent = '';
          }
        }
      });
    },
    [element],
  );
  return slot;
}

export function makeChildSlot(
  element: ElementSignal | Signal<ShadowRoot>,
): Slot<Element | undefined> {
  const slot = createSlot<Element | undefined>();
  let previousValue: Element | undefined = undefined;
  effect(
    (elementValue) => {
      slot.set((value: Element | undefined) => {
        if (value) {
          if (previousValue) {
            elementValue?.replaceChild(value, previousValue);
          } else {
            elementValue?.appendChild(value);
          }
        } else if (previousValue) {
          elementValue?.removeChild(previousValue);
        }
        return () => {
          previousValue = value;
        };
      });
    },
    [element],
  );
  return slot;
}

export function html(elementName: string) {
  return signal(document.createElement(elementName));
}
