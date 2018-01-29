interface AlgIronComponent {
}

interface Event {
  path: Array<HTMLElements>
}

interface EventTarget {
  eventManager: EventManager;
}

interface HTMLElement {
  center: boolean;
  controller: string;
  initialOpacity: number;
  opacityDecayVelocity: number;
  recenters: boolean;
  replaceWith(HTMLElement);
}

interface Node {
  getRootNode(): ShadowRoot;
}

interface String {
  padStart(number, string): string;
}

interface UIEvent {
  x: number;
  y: number;
}