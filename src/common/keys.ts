const apiKeyNotFound = Symbol("apiKeyNotFound");

enum ChromeStorageKeys {
  API_KEY = "freesidebar_api_key",
  MESSAGE_TEMPLATE = "freesidebar_message_tempalte"
}

export {
  apiKeyNotFound,
  ChromeStorageKeys
};
