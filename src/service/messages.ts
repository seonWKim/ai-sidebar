import { OpenaiChatMessage } from '@/service/openai';
import { Message } from '@/common/message';

/**
 * A class that holds chat messages and notifies listeners when messages are pushed or cleared.
 */
class HookedMessages {
  messages: Message[];
  onPushed: (messages: Message[]) => void;
  onCleared: () => void;

  constructor(onPushed: (messages: Message[]) => void, onCleared: () => void) {
    this.messages = [];
    this.onPushed = onPushed;
    this.onCleared = onCleared;
  }

  public pushMessage(message: Message) {
    this.messages.push(message);
    this.onPushed(this.messages);
  }

  public clearMessages() {
    this.messages = [];
    this.onCleared();
  }

  public hasMessages() {
    return this.messages.length > 0;
  }

  public lastMessage() {
    if (this.messages.length == 0) {
      return null;
    }

    return this.messages[this.messages.length - 1];
  }
}

export { HookedMessages };
