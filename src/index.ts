/// <reference lib="deno.unstable" />
import { createWebView } from "jsr:@justbe/webview";
import server from "./server/index.ts";
import * as path from '@std/path';


const result = await Deno.bundle({
  entrypoints: [
    './src/window/index.html',
    './src/window/preload.ts',
    './src/window/index.ts'
  ],
  outputDir: './dist',
  minify: true,
  platform: 'browser',
  format: 'esm',
  write: false,
})

const files = new Map<string, string>();

for (const file of result.outputFiles || []) {
  const fileName = path.basename(file.path);
  
  if (/index-[A-Z0-9]+\.js/.test(fileName)) {
    files.set('index', file.text());
  }

  if (/preload-[A-Z0-9]+\.js/.test(fileName)) {
    files.set('preload', file.text());
  }

  if (fileName === 'index.html') {
    files.set('html', file.text());
  }
}

const webview = await createWebView({
  title: 'Hello from Webview',
  html: files.get('html') || '',
  devtools: true,
  focused: true,
  ipc: true,
  initializationScript: files.get('preload') || ''
})

const serverAbortController = new AbortController()

webview.on('started', async () => {  
  await webview.eval(files.get('index') || '');
  console.log('Webview is ready');
})

webview.on('closed', () => {
  serverAbortController.abort();
});

webview.on('ipc', (event) => {
  console.log('IPC message from webview:', event.message);
});

server(serverAbortController.signal);
webview.waitUntilClosed();
