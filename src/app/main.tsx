import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/shared/styles/index.css";
// Generated theme/event palettes (from src/styles/themePalettes.ts). Imported
// after index.css so the .theme-* rules layer on top of the :root defaults.
import "virtual:theme.css";
import App from "@/app/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
