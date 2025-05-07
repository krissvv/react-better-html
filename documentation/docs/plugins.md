---
title: Plugins
description: Available plugins for the library and how to use them.
sidebar_position: 3
---

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
   reactRouterDomPlugin
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

The `react-router-dom` plugin allows you to use the `react-router-dom` library to navigate to the links in the HTML. It also unlocks new functionalities for a number of components like the [`<Modal>`](./components/modal#used-with-plugins) and others.
