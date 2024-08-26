import { html, LitElement, type TemplateResult } from '@lit';
import { customElement, property } from '@lit/decorators.js';

@customElement('counter-')
export class Counter extends LitElement {
  @property({ type: Number }) accessor count = 0;


  increment() : void {
    this.count += 1;
    console.log(`Count is now: ${this.count}`);
    globalThis.ipc.postMessage(`Count updated to ${this.count}`);
  }

  override render() : TemplateResult {
    return html`
      <button type="button" @click=${() => this.increment()}>Count: ${this.count}</button>
    `;
  }
}
