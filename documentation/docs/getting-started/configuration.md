---
title: Configuration
description: Configure theme, icons, assets and more for your UI.
sidebar_position: 2
---

import HighlightedText from "../../src/components/HighlightedText"

# Configuration

The `react-better-html` library allows you to configure various aspects of its components through the `<BetterHtmlProvider>` wrapper component. This includes customizing the theme, icons, assets and more.

## BetterHtmlProvider

The `<BetterHtmlProvider>` component should wrap your application's root component to apply the configuration.

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

This is enough for the components to work with the [default configuration](#default-configuration) that the library comes with. They can be overridden by passing `value` prop to the `<BetterHtmlProvider>` tag.

:::note
If no value is provided, then all components in the library will use the default configuration that comes with the library. Check out the [default configuration](#default-configuration)
:::

## Theme configuration

It accepts object of type [`Theme`](../types/theme) and can customize the `styles` and `colors`. Colors support theme management.

```jsx
<BetterHtmlProvider
   value={{
      ...
      // highlight-start
      theme: {
         light: {
            colors: {
               backgroundBase: "#f0f0f0"
            }
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

All properties are optional - the [default configuration](#default-configuration) values will be used otherwise.

:::tip
We recommend using the default values initially and change them only if needed by your special use-cases.
:::

## Icons configuration

It accepts object of type [`IconConfig`](../types/icon-config) and can customize the already predefined ones. You can also define your own icons and use them by name in the [Icon](../components/icon) component.

```jsx
<BetterHtmlProvider
   value={{
      ...
      // highlight-start
      icons: {
         XMark: { // `XMark` is the name of the icon
            width: 384,
            height: 512,
            paths: [
               {
                  d: "M342.6 150.6c12.5-12.5 ...",
                  type: "fill"
               }
            ]
         },
         ...
      },
      // highlight-end
      ...
   }}
>
   <App />
</BetterHtmlProvider>
```

## Assets configuration

It accepts object of type [`AssetConfig`](../types/asset-config) and can override the already predefined ones. You can also define your own images/assets and use them by name in the [Image](../components/image) component.

```jsx
// highlight-next-line
import logoAsset from "../assets/logo.svg";

<BetterHtmlProvider
   value={{
      ...
      // highlight-start
      assets: {
         logo: logoAsset, // `logo` is the name of the asset
         ...
      },
      // highlight-end
      ...
   }}
>
   <App />
</BetterHtmlProvider>
```

## Default Configuration

Here are the default values used in the global configuration of the components

### Theme

the default colors used in the library are:

-  textPrimary - <HighlightedText color="#111111">#111111</HighlightedText>
-  textSecondary - <HighlightedText color="#777777">#777777</HighlightedText>
-  label - <HighlightedText color="#111111">#111111</HighlightedText>
-  primary - <HighlightedText color="#6d466b">#6d466b</HighlightedText>
-  secondary - <HighlightedText color="#412234">#412234</HighlightedText>
-  success - <HighlightedText color="#28a745">#28a745</HighlightedText>
-  info - <HighlightedText color="#17a2b8">#17a2b8</HighlightedText>
-  warn - <HighlightedText color="#ffc107">#ffc107</HighlightedText>
-  error - <HighlightedText color="#dc3545">#dc3545</HighlightedText>
-  backgroundBase - <HighlightedText color="#f8f8f8" isLight>#f8f8f8</HighlightedText>
-  backgroundSecondary - <HighlightedText color="#e8e8e8" isLight>#e8e8e8</HighlightedText>
-  backgroundContent - <HighlightedText color="#ffffff" isLight>#ffffff</HighlightedText>
-  border - <HighlightedText color="#ced4da" isLight>#ced4da</HighlightedText>

<br />
the default styles used in the library are:

-  space - `16px`
-  gap - `8px`
-  borderRadius - `10px`
-  fontFamily - `Arial, sans-serif`
-  transition - `ease 0.2s`

:::tip
Those styles are tested in different projects and UI layouts and fit 85% of the use-cases, so you are not likely to change them.
:::

### Icons

the default icons used in the library are:

-  XMark - The symbol `X`

### Assets

the default assets used in the library are:

-  logo - The logo of the project (you can override it with your own logo)
