import { StrictMode } from "react";
import { RecoilRoot } from "recoil";
import { createRoot } from "react-dom/client";
import "./index.css";
import { DemoComponent } from "./examples/recoil-async-use-callback";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <DemoComponent />
    </RecoilRoot>
  </StrictMode>
);
