import { v4 as uuidv4 } from 'uuid';
import { OpenaiRole } from '@/service/openai';

/**
 * @param id - unique id for the message
 * @param role - the {@link OpenaiRole}
 * @parma type - "sent" or "received"
 * @param text - the text of the message, message template may be applied
 * @param originalText - the original text of the message, message template is not applied
 * @param canceled - whether the message is canceled during streaming
 */
export interface Message {
  id: ReturnType<typeof uuidv4>;
  role: OpenaiRole;
  type: 'sent' | 'received';
  text: string[];
  originalText: string[];
  canceled: boolean;
}
