import { defineStore } from "pinia";
import Openai from "openai";

const chromeStorageApiKey = "freesidebar_api_key";
export const appStore = defineStore("app", {
  state: () => ({
    openai: null as (Openai | null),
  }),
  getters: {
    openaiReadOny: (state) => state.openai,
    mockOpenai: (state) => import.meta.env.VITE_MOCK_OPENAI_API === 'true',
    mockOpenaiApiResponseInterval: (state) => import.meta.env.VITE_MOCK_OPENAI_API_RESPONSE_INTERVAL_MILLIS || 50
  },
  actions: {
    async initializeOpenAi() {
      let openApiKey: string = ""
      try {
        const chromeStorage = await chrome?.storage?.local?.get(chromeStorageApiKey);
        openApiKey = chromeStorage[chromeStorageApiKey] || "";
      } catch (e) {
        // skip
      }

      this.openai = new Openai({
        apiKey: openApiKey,
        dangerouslyAllowBrowser: true
      });
    },
    setOpenAiKey(apiKey: string) {
      chrome?.storage?.local?.set({ [chromeStorageApiKey]: apiKey });
      if (this.openai) {
        this.openai.apiKey = apiKey;
      } else {
        this.openai = new Openai({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        });
      }
    }
  }
});
