import { v4 as uuidv4 } from 'uuid';
import { OpenaiRole } from '@/service/openai';
import { ChatType } from '@/common/chat-type';

/**
 * @param id - unique id for the message
 * @param role - the {@link OpenaiRole}
 * @parma type - "sent" or "received"
 * @param text - the text of the message, message template may be applied
 * @param originalText - the original text of the message, message template is not applied
 */
interface Message {
  id: ReturnType<typeof uuidv4>;
  role: OpenaiRole;
  type: ChatType;
  action: 'sent' | 'received';
  text: string[];
  originalText: string[];
  meta: MessageMeta;
}

/**
 * @param canceled - whether the stream is canceled
 * @param completed - whether the stream is completed
 */
interface MessageMeta {
  canceled: boolean;
  completed: boolean;
}

/**
 * Cancels message streaming.
 * @param message - message to cancel
 */
function cancelMessageStreaming(message: Message) {
  message.meta.canceled = true;
}

function completeMessage(message: Message) {
  message.meta.completed = true;
}

export { Message, MessageMeta, cancelMessageStreaming, completeMessage };
