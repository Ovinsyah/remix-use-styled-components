import { PassThrough } from "node:stream";
import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {
  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext
    )
    : handleBrowserRequest(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext
    );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return handleStyledComponentsRender(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    "onAllReady"
  );
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return handleStyledComponentsRender(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    "onShellReady"
  );
}

function handleStyledComponentsRender(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  readyCallback: "onAllReady" | "onShellReady"
) {
  const sheet = new ServerStyleSheet();

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      sheet.collectStyles(
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
      ),
      {
        [readyCallback]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          const styles = sheet.getStyleTags();
          const transformStream = new TransformStream({
            transform(chunk, controller) {
              const html = new TextDecoder().decode(chunk);
              const transformedHtml = html.replace('</head>', `${styles}</head>`);
              controller.enqueue(new TextEncoder().encode(transformedHtml));
            }
          });

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream.pipeThrough(transformStream), {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(() => {
      abort();
      sheet.seal();
    }, ABORT_DELAY);
  });
}