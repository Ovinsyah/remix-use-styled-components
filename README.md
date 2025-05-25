# Remix with Styled Components SSR Integration

[![Remix Version](https://img.shields.io/badge/remix-1.15.0+-blue.svg)](https://remix.run/)
[![Styled Components](https://img.shields.io/badge/styled--components-6.0.0+-brightgreen.svg)](https://styled-components.com/)

This project demonstrates a complete integration of Styled Components with server-side rendering in Remix, including proper streaming support and TypeScript types.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Implementation](#implementation)
  - [Server Setup](#server-setup)
  - [Client Setup](#client-setup)

## Features

- 🚀 **Full SSR Support**: Styles rendered server-side
- 💅 **Styled Components v6+**: Latest features support
- ⚡ **Streaming Compatible**: Works with Remix's streaming
- 🛡️ **No FOUC**: Eliminates flash of unstyled content
- 🔍 **TypeScript Ready**: Includes type definitions
- 🎨 **Ant Design Compatible**: Works alongside Ant Design

## Installation


```bash
npm install styled-components @types/styled-components
# or
yarn add styled-components @types/styled-components
```

## Project Structure
```
app/
├── entry.client.tsx        # Client entry with StyleSheetManager
├── entry.server.tsx       # Server entry with style collection
├── root.tsx               # Main layout with global styles
├── styles/
│   └── global.ts          # Global styled components styles
└── components/
    ├── Button/
    │   ├── index.tsx      # Component logic
    │   └── styles.ts      # Component styles
    └── ...                # Other styled components
```

## Implementation
### server-setup
```
import { ServerStyleSheet } from 'styled-components';
// ... other imports

function handleStyledComponentsRender(
  // ... args
) {
  const sheet = new ServerStyleSheet();

  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      sheet.collectStyles(<RemixServer /*...*/ />),
      {
        onShellReady() {
          const styles = sheet.getStyleTags();
          const transformStream = new TransformStream({
            transform(chunk, controller) {
              const html = new TextDecoder().decode(chunk);
              const withStyles = html.replace('</head>', `${styles}</head>`);
              controller.enqueue(new TextEncoder().encode(withStyles));
            }
          });

          resolve(
            new Response(stream.pipeThrough(transformStream), {
              headers: responseHeaders,
              status: responseStatusCode,
            }
          );
          pipe(body);
        },
        // ... error handlers
      }
    );

    setTimeout(() => {
      abort();
      sheet.seal();
    }, ABORT_DELAY);
  });
}
```
### client-setup
```
import { StyleSheetManager } from 'styled-components';

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
```

Touch me

[<img alt="ovinsyah" src="https://ovinsyah.com/ini-logo.png" width="40" />](https://ovinsyah.com/)