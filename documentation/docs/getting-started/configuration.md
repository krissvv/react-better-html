---
title: Configuration
description: Configure theme, icons, assets and more for your UI.
sidebar_position: 2
---

# Configuration

The `react-better-html` library allows you to configure various aspects of its components through the `BetterHtmlProvider`. This includes customizing the theme, icons, and assets.

## BetterHtmlProvider

The `BetterHtmlProvider` component should wrap your application's root component to apply the configuration.

```jsx title="main.tsx"
import { createRoot } from "react-dom/client";
// highlight-next-line
import { BetterHtmlProvider } from "react-better-html";

import App from "./App";

const root = document.getElementById("root");
createRoot(root).render(
   // highlight-next-line
   <BetterHtmlProvider>
      <App />
      // highlight-next-line
   </BetterHtmlProvider>
);
```

This is enough for the components to work with the default configurations that the library comes with. They can be overridden when passing `value` prop to the `<BetterHtmlProvider>` tag.

:::note
If no value is provided, then all components in the library will use the default configuration that comes with the library. Check out the [default configuration](#default-configuration)
:::

## Theme configuration

You can customize the theme by providing a `value` prop to the `<BetterHtmlProvider>`. The theme includes `styles` and `colors`.

```jsx
<BetterHtmlProvider
   value={{
      ...
      // highlight-start
      theme: {
         colors: {
            backgroundBase: "#f0f0f0",
         },
         styles: {
            gap: 20
         }
      },
      // highlight-end
      ...
   }}
>
   <App />
</BetterHtmlProvider>
```

No properties are required. The [default configuration](#default-configuration) values will be used otherwise. Check out the [`Theme`](../types/theme) type for full details on what can be configured.

## Icons configuration

🚧 Work in progress 🚧

## Assets configuration

🚧 Work in progress 🚧

## Default Configuration

🚧 Work in progress 🚧
