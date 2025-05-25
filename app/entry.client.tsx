import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { StyleSheetManager } from "styled-components";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StyleSheetManager>
        <RemixBrowser />
      </StyleSheetManager>
    </StrictMode>
  );
});