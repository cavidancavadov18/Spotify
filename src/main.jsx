import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.__pwaInstall = e;
});
window.addEventListener("appinstalled", () => {
  window.__pwaInstall = void 0;
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
