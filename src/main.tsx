import { StrictMode } from "react";
import { RecoilRoot } from "recoil";
import { createRoot } from "react-dom/client";
import "./index.css";
import { DemoComponent } from "./examples/jotai-async-atom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <DemoComponent />
    </RecoilRoot>
  </StrictMode>
);
