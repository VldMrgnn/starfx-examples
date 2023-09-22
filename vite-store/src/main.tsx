import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { parallel } from 'starfx';
import { Provider } from 'starfx/react';
import { configureStore, take } from 'starfx/store';

import { api, schema } from './api.ts';
import App from './App.tsx';
import { setupDevTool, subscribeToActions } from './devtools.ts';

init().then(console.log).catch(console.error);

async function init() {
  const store = configureStore({
    initialState: schema.initialState,
    middleware: [
      function* logger(ctx, next) {
        yield* next();
        console.log("store updater", ctx);
      },
    ],
  });
  const fx = (window as any).fx = store;

  store.run(function* (): any {
    setupDevTool(store, {name: 'starfx-vite-store'});
    const group = yield* parallel([
      function* logger() {
        while (true) {
          const action = yield* take("*");
          subscribeToActions(fx, {action})
        }
      },
      api.bootup,
    ]);
    yield* group;
  });

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <App id="1" />
      </Provider>
    </React.StrictMode>
  );
}
