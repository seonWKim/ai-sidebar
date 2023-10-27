import { ChromeStorageKeys } from '@/common/keys';

export enum EventName {
  OPEN_SETTINGS = 'open-settings',
  OPEN_SNACKBAR = 'open-snackbar',
  OPEN_SIDEPANEL = 'OpenSidePanel',
}

export class EventBus {
  events: { [eventName: string]: Function[] };

  constructor() {
    this.events = {};
  }

  on(eventName: EventName, fn: (data: any) => void) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  off(eventName: EventName, fn: (data: any) => void) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  emit(eventName: EventName, data: any) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn: Function) {
        fn(data);
      });
    }
  }
}

export const eventBus = new EventBus();

export const documentEventListener = {
  pushedKeys: {} as Record<string, string>,
  temporary: {} as Record<string, boolean>,
  async initializeEventListeners() {
    this.addOpenSidePanelListener();
    this.addKeydownEventListener();
    this.addKeyupEventListener();
  },
  async emitEvent(name: string) {
    document.dispatchEvent(new Event(name));
  },
  addOpenSidePanelListener() {
    document.addEventListener(
      EventName.OPEN_SIDEPANEL,
      function (_) {
        chrome?.runtime?.sendMessage({
          type: 'open_side_panel',
        });
      },
      false
    );
  },
  addKeydownEventListener() {
    document.addEventListener(
      'keydown',
      async (event) => {
        const name = event.key;
        const code = event.code;
        this.pushedKeys[code] = name;

        const pushedKeyValues = Object.values(this.pushedKeys).map((key) => key.toLowerCase());
        if (
          (await this.getCustomKeyMap()).every((key) => pushedKeyValues.includes(key.toLowerCase()))
        ) {
          console.log(pushedKeyValues);
          this.pushedKeys = {};
          await this.emitEvent(EventName.OPEN_SIDEPANEL);
        } else {
          console.log(`failed: ${pushedKeyValues}, should use: ${await this.getCustomKeyMap()}}`);
        }
      },
      false
    );
  },
  addKeyupEventListener() {
    document.addEventListener('keyup', (event) => {
      const code = event.code;
      delete this.pushedKeys[code];
    });
  },
  async getCustomKeyMap(): Promise<string[]> {
    const openSidePanelEventTriggerKeysStr = await chrome?.storage?.local?.get(
      ChromeStorageKeys.OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS
    );
    let openSidePanelEventTriggerKeyNames = ['Control', 'Shift', 'O'];
    if (
      !!openSidePanelEventTriggerKeysStr &&
      openSidePanelEventTriggerKeysStr[ChromeStorageKeys.OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS]
    ) {
      openSidePanelEventTriggerKeyNames = JSON.parse(
        openSidePanelEventTriggerKeysStr[ChromeStorageKeys.OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS]
      );
    }
    return openSidePanelEventTriggerKeyNames;
  },
  async getCustomOpenSidePanelEventTriggerKeyNames(): Promise<string[]> {
    return (await this.getCustomKeyMap()).slice(2);
  },
  setCustomOpenSidePanelEventTriggerKeyNames(keyName: string) {
    const customKey = keyName ? keyName : 'O';
    const customKeyMap = ['Control', 'Shift', customKey];

    chrome?.storage?.local?.set({
      [ChromeStorageKeys.OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS]: JSON.stringify(customKeyMap),
    });
  },
};
