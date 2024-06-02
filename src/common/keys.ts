const apiKeyNotFound = Symbol('apiKeyNotFound');

enum ChromeStorageKeys {
  API_KEY = 'freesidebar_api_key',
  MESSAGE_TEMPLATE = 'freesidebar_message_tempalte',
  SHOW_MESSAGE_TEMPLATE = 'freesidebar_show_message_template',
  REMEMBER_CONTEXT = 'freesidebar_remember_context',
  CONTEXT_MAX_NO = 'free_sidebar_context_max_no',
  TEMPERATURE = 'freesidebar_temperature',
  IMAGE_CONFIGURATION_COUNT = 'freesidebar_image_configuration_count',
  IMAGE_CONFIGURATION_SIZE = 'freesidebar_image_configuration_size',
  THEME = 'freesidebar_theme',
  CUSTOM_TEMPLATES = 'freesidebar_custom_templates',
  OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS = 'freesidebar_open_side_panel_event_trigger_keys',
  OPEN_SIDE_PANEL_EVENT_TRIGGER_ENABLED = 'freesidebar_open_side_panel_event_trigger_enabled',
  SHOW_SIDE_PANEL = 'freesidebar_show_side_panel',
  STORED_MESSAGES = 'freesidebar_stored_messages',
}

export { apiKeyNotFound, ChromeStorageKeys };
