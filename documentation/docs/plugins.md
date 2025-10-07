---
title: Plugins
description: Available plugins for the library and how to use them.
sidebar_position: 3
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

The `react-better-html` library allows you to configure the plugins through the [`<BetterHtmlProvider>`](../getting-started/configuration) wrapper component.

:::warning
Make sure to never change the plugins array while the app is running. This can cause unexpected behavior.
:::

## Setup

To start using a plugin, you need to pass it to the `plugins` array in the [`<BetterHtmlProvider>`](../getting-started/configuration) component.

```jsx title="main.tsx"
import { createRoot } from "react-dom/client";
import { BetterHtmlProvider, BetterHtmlPlugin, reactRouterDomPlugin } from "react-better-html";

import App from "./App";

// highlight-next-line
const plugins: BetterHtmlPlugin[] = [
   // highlight-next-line
   reactRouterDomPlugin()
   // highlight-next-line
];

const root = document.getElementById("root");
createRoot(root).render(
   // highlight-next-line
   <BetterHtmlProvider plugins={plugins}>
      <App />
   </BetterHtmlProvider>
);
```

## Available plugins

### React Router DOM

The `reactRouterDomPlugin` plugin allows you to use the `react-router-dom` library to navigate to the links in the HTML. It also unlocks new functionalities for a number of components like the [`<Modal>`](./components/modal#used-with-plugins) and others. No configuration in needed when initializing the plugin.

### Alerts

The `alertsPlugin` plugin enables alerts in the DOM. Can be used with the [`useAlertControls`](./hooks/use-alert-controls) hook. Configuration can be passed when initializing the plugin.

```typescript
alertsPlugin({
   position: "bottom",
   align: "right",
   defaultDuration: "auto",
   maxWidth: 460,
   withLoaderBar: true,
   withCloseButton: true
});
```

-  **`position`**: The position of the alerts. Can be `top` or `bottom`. Defaults to `bottom`.
-  **`align`**: The alignment of the alerts. Can be `left`, `center` or `right`. Defaults to `right`.
-  **`defaultDuration`**: The default duration of the alerts. Can be `auto` or a number in milliseconds. Defaults to `auto`.
-  **`maxWidth`**: The maximum width of the alerts. Defaults to `460`.
-  **`withLoaderBar`**: Whether to show a loader bar in the alert box. When the alert is hovered with the mouse the loader pauses. Defaults to `true`.
-  **`withCloseButton`**: Whether to show a close button in the alert box. Defaults to `true`.

### LocalStorage

The `localStoragePlugin` plugin enables localStorage functionality. Can be accessed from [`generateLocalStorage`](./functions/localStorage) function. Configuration can be passed when initializing the plugin.

```typescript
localStoragePlugin({
   encryption: {
      enabled: true,
      secretKey: "YOUR_SECRET_KEY",
      iv: "YOUR_IV"
   }
});
```

-  **`encryption`**: The encryption options for the localStorage. Can be enabled with `enabled: true`. When enabled it requires `secretKey` and `iv` properties. Defaults to `enabled: false`.

To generate a `secretKey` and `iv` you can use the following node commands:

<Tabs>
   <TabItem value="secretKey" label="Generate secretKey" default>

      ```bash
      node -e 'console.log(`SECRET_KEY:`, require(`crypto`).randomBytes(32).toString(`hex`))'
      ```

   </TabItem>

   <TabItem value="iv" label="Generate iv" default>

      ```bash
      node -e 'console.log(`IV:`, require(`crypto`).randomBytes(16).toString(`hex`))'
      ```

   </TabItem>
</Tabs>
