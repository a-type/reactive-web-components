# reactive-web-components

This is purely for fun, sketching out ideas and gaining intuition about reactivity - how to power it, usage patterns, shortcomings of a maximalist approach, etc.

See `./demo/src/index.ts` for usage. Note that the `./demo/index.html` file is declaring the custom element(s).

Local packages are in the `@wc3` scope, because this is my third attempt at playing with Web Components - not putting a lot of thought into naming.

## Concepts so far

### Signal

A source value. Currently you can `.get` or `.set`. You can also `.connect` but I think this is effectively a private behavior, see Effect instead.

The purpose is to hold a value which can change over time.

### Effect

Accepts multiple Signal dependencies and re-runs the provided callback with their values whenever one changes. Used for triggering side-effects, including setting other Signals.

### Slot

A name for a Signal which holds a Function. Special only because you can use the `connect(signal, slot)` function to 'wire up' a Signal to a Slot which utilizes it. You could guess how this is composed - it uses an `effect((fn, input) => fn(input), [fn, input])`.

Whenever either the Signal or Slot change, the Slot will be re-run with the latest value.

### Transform

Composed of a Signal and an Effect, a Transform takes one or more dependencies and computes a new Signal value whenever they change. Should maybe be called Reducer?

### Template

A fancy Transform which exposes a Tagged Template Literal interface, so you can interpolate multiple `Signal<string>`s inside a string. Outputs a `Signal<string>`.

### HTML

For convenience I have some HTML-related tools:

`html`: Pass an element name to create a Signal that contains that element.

`makeAttributeSlot`: Pass a `Signal<Element>` and an attribute name to create a Slot which sets that attribute on the current value of the provided element signal.

`makeTextContentSlot`: Like `makeAttributeSlot` but for `.textContent`.

`makeEventSlot`: Subscribes an input `Signal<(event: Event) => void>` to an event by name. The typings leave something to be desired.

`makeChildSlot`: Like `makeAttributeSlot` but inserts a provided `Signal<Element>` into children. A change in value of the child `Signal<Element>` will replace the prior child in-place, even if multiple children exist.

### Web Components

`define` is exported so you can define a Custom Element. You pass a valid name and a function to set up component behavior.

Unlike React (and like Solid) this function is only run once. All changing data and interactivity should be modeled via reactive stuff.

Provided to this function is a toolbox parameter. The toolbox includes:

`ui`: Append a `Signal<Element>` to the Shadow DOM root of the custom element (using `makeChildSlot` under the hood).

`css`: A tagged template literal which defines a stylesheet scoped to the Shadow DOM root. You can interpolate `Signal<string>`s. The contents of the stylesheet are reactive to these interpolations. I know very little about stylesheet replacement performance, this is the most naive approach possible (replace `textContent`).
