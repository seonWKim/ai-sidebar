/**
 * All the chat types in the system
 */
enum ChatType {
  TEXT = 'Text',
  IMAGE = 'Image',
}

/**
 * All the configuration buttons in the system
 */
enum ConfigurationButtons {
  MESSAGE_TEMPLATE = 'messageTemplate',
  REMEMBER_CONTEXT = 'rememberContext',
  OPENAI_MODEL = 'openaiModel',
  TEMPERATURE = 'temperature',
  IMAGE_CONFIG = 'imageConfig',
}

/**
 * Which {@link ConfigurationButtons} is available for which {@link ChatType}
 */
const ChatTypeConfigButtonAvailability: Record<ChatType, Set<ConfigurationButtons>> = {
  [ChatType.TEXT]: new Set([
    ConfigurationButtons.MESSAGE_TEMPLATE,
    ConfigurationButtons.REMEMBER_CONTEXT,
    ConfigurationButtons.OPENAI_MODEL,
    ConfigurationButtons.TEMPERATURE,
  ]),
  [ChatType.IMAGE]: new Set([
    ConfigurationButtons.MESSAGE_TEMPLATE,
    ConfigurationButtons.IMAGE_CONFIG,
  ]),
};

export { ChatType, ConfigurationButtons, ChatTypeConfigButtonAvailability };
