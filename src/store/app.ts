import { defineStore } from 'pinia';
import Openai from 'openai';
import { ChromeStorageKeys } from '@/common/keys';
import { Template } from '@/common/templates';

export const appStore = defineStore('app', {
  state: () => ({
    openai: null as Openai | null,
    customTemplates: [] as Template[],
  }),
  getters: {
    openaiReadOny: (state) => state.openai,
    mockOpenai: (_) => import.meta.env.VITE_MOCK_OPENAI_API === 'true',
    mockOpenaiApiResponseInterval: (_) =>
      import.meta.env.VITE_MOCK_OPENAI_API_RESPONSE_INTERVAL_MILLIS || 50,
  },
  actions: {
    async initializeOpenAi() {
      const openApiKey = await this.getFromChromeStorage(ChromeStorageKeys.API_KEY);
      if (openApiKey) {
        this.openai = new Openai({
          apiKey: openApiKey,
          dangerouslyAllowBrowser: true,
        });
      }
    },
    async setOpenAiKey(apiKey: string) {
      await this.saveToChromeStorage(ChromeStorageKeys.API_KEY, apiKey);
      if (this.openai) {
        this.openai.apiKey = apiKey;
      } else {
        this.openai = new Openai({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true,
        });
      }
    },
    async saveToChromeStorage(key: string, value: string) {
      await chrome?.storage?.local?.set({ [key]: value });
    },
    async getFromChromeStorage(key: string): Promise<string> {
      const result = await chrome?.storage?.local?.get(key);
      return result ? result[key] : '';
    },
    async initializeCustomTemplates() {
      const customTemplatesStr =
        (await this.getFromChromeStorage(ChromeStorageKeys.CUSTOM_TEMPLATES)) || '[]';
      this.customTemplates = JSON.parse(customTemplatesStr);
    },
    async saveCustomTemplate(customTemplate: Template) {
      this.customTemplates.push(customTemplate);
      await this.saveToChromeStorage(
        ChromeStorageKeys.CUSTOM_TEMPLATES,
        JSON.stringify(this.customTemplates)
      );
    },
    async deleteCustomTemplate(customTemplateId: number) {
      const index = this.customTemplates.findIndex((t) => t.id === customTemplateId);
      if (index > -1) {
        this.customTemplates.splice(index, 1);
        await this.saveToChromeStorage(
          ChromeStorageKeys.CUSTOM_TEMPLATES,
          JSON.stringify(this.customTemplates)
        );
      }
    },
  },
});
