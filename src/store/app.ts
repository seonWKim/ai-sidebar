import { defineStore } from "pinia";
import Openai from "openai";
import { ChromeStorageKeys } from "@/common/keys";

export const appStore = defineStore("app", {
  state: () => ({
    openai: null as (Openai | null)
  }),
  getters: {
    openaiReadOny: (state) => state.openai,
    mockOpenai: (state) => import.meta.env.VITE_MOCK_OPENAI_API === "true",
    mockOpenaiApiResponseInterval: (state) => import.meta.env.VITE_MOCK_OPENAI_API_RESPONSE_INTERVAL_MILLIS || 50
  },
  actions: {
    async initializeOpenAi() {
      const openApiKey = await this.getFromChromeStorage(ChromeStorageKeys.API_KEY);
      if (openApiKey) {
        this.openai = new Openai({
          apiKey: openApiKey,
          dangerouslyAllowBrowser: true
        });
      }
    },
    setOpenAiKey(apiKey: string) {
      this.saveToChromeStorage(ChromeStorageKeys.API_KEY, apiKey);
      if (this.openai) {
        this.openai.apiKey = apiKey;
      } else {
        this.openai = new Openai({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        });
      }
    },
    saveToChromeStorage(key: string, value: string) {
      chrome?.storage?.local?.set({ [key]: value });
    },
    async getFromChromeStorage(key: string): Promise<string> {
      const result = await chrome?.storage?.local?.get(key);
      return result ? result[key] : "";
    }
  }
});
