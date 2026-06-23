import { createApp } from "vue";
import App from "#/App.vue";
import { router } from "#/router/index";

async function main() {
  try {
    createApp(App).use(router).mount("#app");
  } catch (error) {
    console.error("❌ Failed to initialize client:", error);
  }
}

main();
