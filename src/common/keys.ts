const apiKeyNotFound = Symbol("apiKeyNotFound");

enum ChromeStorageKeys {
  API_KEY = "freesidebar_api_key",
  MESSAGE_TEMPLATE = "freesidebar_message_tempalte",
  SHOW_MESSAGE_TEMPLATE = "freesidebar_show_message_template",
  REMEMBER_CONTEXT = "freesidebar_remember_context",
  CONTEXT_MAX_NO = "free_sidebar_context_max_no",
  TEMPERATURE = "freesidebar_temperature",
  THEME = "free_sidebar_theme",
}

export {
  apiKeyNotFound,
  ChromeStorageKeys
};
