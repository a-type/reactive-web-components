import { connect } from './connect';
import { ElementSignal, makeChildSlot, makeTextContentSlot } from './html';
import { Signal, signal } from './signal';
import { template } from './template';

type DefineTools = {
  ui(element: ElementSignal): ElementSignal;
  css(
    strings: TemplateStringsArray,
    ...interpolations: [] | [Signal<string>, ...Signal<string>[]]
  ): ElementSignal;
};
type Definer = (tools: DefineTools) => void;

type NameWithHyphen = `${string}-${string}`;

export function define(name: NameWithHyphen, init: Definer) {
  class CustomElement extends HTMLElement {
    private shadow: ShadowRoot;
    private shadowSignal: Signal<ShadowRoot>;

    constructor() {
      super();
      this.shadow = this.shadowRoot || this.attachShadow({ mode: 'open' });
      this.shadowSignal = signal(this.shadow);

      init({
        ui: this.ui,
        css: this.css,
      });
    }

    ui = (element: ElementSignal) => {
      const slot = makeChildSlot(this.shadowSignal);
      connect(element, slot);
      return element;
    };

    css = (
      strings: TemplateStringsArray,
      ...interpolations: [Signal<string>, ...Signal<string>[]]
    ) => {
      const styleElement = this.ui(signal(document.createElement('style')));
      connect(
        template(strings, ...interpolations),
        makeTextContentSlot(styleElement),
      );
      return styleElement;
    };
  }
  customElements.define(name, CustomElement);
}
