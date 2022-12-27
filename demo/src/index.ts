import {
  signal,
  define,
  connect,
  interval,
  makeTextContentSlot,
  transform,
  makeEventSlot,
  makeAttributeSlot,
  html,
  makeChildSlot,
} from '@wc3/core';

define('c-counter', ({ ui, css }) => {
  const container = ui(html('div'));
  connect(signal('container'), makeAttributeSlot(container, 'class'));

  css`
    .container {
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 5px;
    }
  `;

  const display = html('span');
  connect(display, makeChildSlot(container));
  connect(signal('display'), makeAttributeSlot(display, 'class'));

  const timer = interval(1000);

  setInterval(() => {
    const random = Math.floor(Math.random() * 3);
    switch (random) {
      case 0:
        display.set(document.createElement('span'));
        break;
      case 1:
        display.set(document.createElement('strong'));
        break;
      case 2:
        display.set(document.createElement('i'));
        break;
    }
  }, 2500);

  connect(
    transform((s) => s.toString(), timer),
    makeTextContentSlot(display),
  );

  css`
    .display {
      color: ${transform((v) => (v % 5 === 0 ? 'red' : 'black'), timer)};
    }
  `;

  const reset = html('button');
  connect(reset, makeChildSlot(container));
  connect(signal('Reset'), makeTextContentSlot(reset));

  connect(
    signal(() => {
      timer.set(0);
      console.log('reset');
    }),
    makeEventSlot(reset, 'click'),
  );
});
