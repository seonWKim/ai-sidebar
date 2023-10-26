/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";
import Landing from "./Landing.vue";

// Composables
import { createApp } from "vue";
import "@/styles/main.css";
// Plugins
import { registerPlugins } from "@/plugins";
import AOS from "aos";
import "aos/dist/aos.css";

const app = createApp(App);
const landing = createApp(Landing);

AOS.init({
  duration: 1000,
});

registerPlugins(app);
registerPlugins(landing);

app.mount("#app");
landing.mount("#landing");
