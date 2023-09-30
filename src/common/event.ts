export enum EventName {
  OPEN_SETTINGS = "open-settings",
  OPEN_SNACKBAR = "open-snackbar",
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
      this.events[eventName].forEach(function(fn: Function) {
        fn(data);
      });
    }
  }
}

export const eventBus = new EventBus();
