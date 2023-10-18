const apiKeyNotFound = Symbol("apiKeyNotFound");

enum ChromeStorageKeys {
  API_KEY = "freesidebar_api_key",
  MESSAGE_TEMPLATE = "freesidebar_message_tempalte",
  REMEMBER_CONTEXT = "freesidebar_remember_context",
  CONTEXT_MAX_NO = "free_sidebar_context_max_no",
}

export {
  apiKeyNotFound,
  ChromeStorageKeys
};
