const apiKeyNotFound = Symbol('apiKeyNotFound');

enum ChromeStorageKeys {
  API_KEY = 'freesidebar_api_key',
  MESSAGE_TEMPLATE = 'freesidebar_message_tempalte',
  SHOW_MESSAGE_TEMPLATE = 'freesidebar_show_message_template',
  REMEMBER_CONTEXT = 'freesidebar_remember_context',
  CONTEXT_MAX_NO = 'free_sidebar_context_max_no',
  TEMPERATURE = 'freesidebar_temperature',
  IMAGE_CONFIGURATION_COUNT = 'free_sidebar_image_configuration_count',
  IMAGE_CONFIGURATION_SIZE = 'free_sidebar_image_configuration_size',
  THEME = 'free_sidebar_theme',
  CUSTOM_TEMPLATES = 'free_sidebar_custom_templates',
  OPEN_SIDE_PANEL_EVENT_TRIGGER_KEYS = 'free_sidebar_open_side_panel_event_trigger_keys',
  OPEN_SIDE_PANEL_EVENT_TRIGGER_ENABLED = 'free_sidebar_open_side_panel_event_trigger_enabled',
  SHOW_SIDE_PANEL = 'show_side_panel',
}

export { apiKeyNotFound, ChromeStorageKeys };
