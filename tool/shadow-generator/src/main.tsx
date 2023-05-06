import "./style/index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import Index from "./pages/index.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);
