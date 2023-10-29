/**
 * Stores information of specific chat type.
 */
class ChatType {
  constructor(
    name: string,
    icon: string,
    messageTemplate: boolean,
    rememberContext: boolean,
    openaiModel: boolean,
    temperature: boolean
  ) {
    this.name = name;
    this.icon = icon;
    this.messageTemplate = messageTemplate;
    this.rememberContext = rememberContext;
    this.openaiModel = openaiModel;
    this.temperature = temperature;
  }

  name: string;
  icon: string;
  messageTemplate: boolean;
  rememberContext: boolean;
  openaiModel: boolean;
  temperature: boolean;
}

/**
 * Stores all chat types in the system.
 */
const ChatTypes = {
  TEXT: new ChatType('Text', 'mdi-format-text', true, true, true, true),
  IMAGE: new ChatType('Image', 'mdi-image-outline', false, false, false, false),
};

export { ChatType, ChatTypes };
