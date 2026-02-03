import { createApp } from "vue";
import App from "./App.vue";
import "./fanta.css";
import "./style.css";

import router from "./router";
createApp(App).use(router).mount("#app");
