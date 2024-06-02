import { OpenaiChatMessage } from '@/service/openai';
import { completeMessage, Message } from '@/common/message';

/**
 * A class that holds chat messages and notifies listeners when messages are pushed or cleared.
 */
class HookedMessages {
  messages: Message[];
  onPushCompleted: (messages: Message[]) => void;
  onCleared: () => void;

  constructor(onPushed: (messages: Message[]) => void, onCleared: () => void) {
    this.messages = [];
    this.onPushCompleted = onPushed;
    this.onCleared = onCleared;
  }

  public pushMessage(message: Message) {
    this.messages.push(message);
  }

  public pushMessageText(text: string) {
    this.lastMessage()?.text.push(text);
  }

  public pushMessageCompleted() {
    if (this.lastMessage() != null) {
      completeMessage(this.lastMessage()!!);
    }
    this.onPushCompleted(this.messages);
  }

  public isCanceled() {
    return !!this.lastMessage()?.meta.canceled;
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
