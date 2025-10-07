---
title: Configuration
description: Configure theme, icons, assets and more for your UI.
sidebar_position: 2
---

import HighlightedText from "../../src/components/HighlightedText"

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

This is enough for the components to work with the [default configuration](#default-configuration) that the library comes with. They can be overridden by passing `config` prop to the `<BetterHtmlProvider>` tag.

:::note
If no value is provided for the `config` prop, then all components in the library will use the default configuration that comes with the library. Check out the [default configuration](#default-configuration)
:::

### App configuration

There are some configuration properties for the whole app that can be set from the `app` object

```jsx
<BetterHtmlProvider
   config={{
      ...
      // highlight-start
      app: {
         contentMaxWidth: 1200
      },
      // highlight-end
      ...
   }}
>
   <App />
</BetterHtmlProvider>
```

| Key             | Value Type | Default Value | Description                                                                                          |
| --------------- | ---------- | ------------- | ---------------------------------------------------------------------------------------------------- |
| contentMaxWidth | `number`   | 1200          | Sets the max content width of the [`<PageContent />`](../components/structure/page-holder) component |

### Theme configuration

It accepts object of type [`Theme`](../types/theme) and can customize the `styles` and `colors`. Colors support theme management.

```jsx
<BetterHtmlProvider
   config={{
      ...
      // highlight-start
      theme: {
         colors: {
            light: {
               backgroundBase: "#f0f0f0"
            },
         }
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

### Icons configuration

It accepts object of type [`IconConfig`](../types/icon-config) and can customize the already predefined ones. You can also define your own icons and use them by name in the [Icon](../components/icon) component.

```jsx
<BetterHtmlProvider
   config={{
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

### Assets configuration

It accepts object of type [`AssetConfig`](../types/asset-config) and can override the already predefined ones. You can also define your own images/assets and use them by name in the [Image](../components/image) component.

```jsx
// highlight-next-line
import logoAsset from "../assets/logo.svg";

<BetterHtmlProvider
   config={{
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

### Loaders configuration

It accepts object of type [`LoaderConfig`](../types/loader-config) and can override the already predefined ones. You can also define your own loaders and use them by name in the app.

```jsx
<BetterHtmlProvider
   config={{
      ...
      // highlight-start
      loaders: {
         testLoader: false, // `testLoader` is the name of the loader
         ...
      },
      // highlight-end
      ...
   }}
>
   <App />
</BetterHtmlProvider>
```

You can access the value of the loaders using the [useLoader](../hooks/use-loader) hook. To change the values dynamically you can use the [useLoaderControls](../hooks/use-loader-controls) hook.

### Components configuration

It accepts a list of components that can be configured. Per every component you can override the default styles and the tag used for the component itself.

An example can be seen below where the `button` component is having the default style overridden and the tag used for the component is changed.

```jsx
<BetterHtmlProvider
   config={{
      ...
      // highlight-start
      components: {
         button: {
            style: {
               default: {
                  backgroundColor: "#16d7ed",
                  color: "#ffffff",
               },
            },
            tagReplacement: {
               buttonComponent: "button",
            },
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

:::note
Currently only the `button` component is supported. But we plan to add more components in the future.
:::

## Default Configuration

Here are the default values used in the global configuration of the components.

### App

The default values for the app constants in the library are:

-  **`contentMaxWidth`** - 1100px

### Theme

The default colors used in the library are (More on the [Theme](../types/theme) type page):

-  textPrimary - <HighlightedText color="#111111">#111111</HighlightedText>
-  textSecondary - <HighlightedText color="#777777">#777777</HighlightedText>
-  textLink - <HighlightedText color="#0894ff">#0894ff</HighlightedText>
-  label - <HighlightedText color="#111111">#111111</HighlightedText>
-  primary - <HighlightedText color="#6d466b">#6d466b</HighlightedText>
-  secondary - <HighlightedText color="#412234">#412234</HighlightedText>
-  accent - <HighlightedText color="#16d7ed" isLight>#16d7ed</HighlightedText>
-  success - <HighlightedText color="#28a745">#28a745</HighlightedText>
-  info - <HighlightedText color="#0fa0da">#0fa0da</HighlightedText>
-  warn - <HighlightedText color="#ffc107" isLight>#ffc107</HighlightedText>
-  error - <HighlightedText color="#dc3545">#dc3545</HighlightedText>
-  base - <HighlightedText color="#f8f8f8" isLight>#f8f8f8</HighlightedText>
-  backgroundBase - <HighlightedText color="#f8f8f8" isLight>#f8f8f8</HighlightedText>
-  backgroundSecondary - <HighlightedText color="#e8e8e8" isLight>#e8e8e8</HighlightedText>
-  backgroundContent - <HighlightedText color="#ffffff" isLight>#ffffff</HighlightedText>
-  border - <HighlightedText color="#ced4da" isLight>#ced4da</HighlightedText>

<br />
The default styles used in the library are:

-  **`space`** - 16px
-  **`gap`** - 8px
-  **`borderRadius`** - 10px
-  **`fontFamily`** - Arial, sans-serif
-  **`transition`** - ease 0.2s

:::tip
Those styles are tested in different projects and UI layouts and fit 85% of the use-cases, so you are not likely to change them.
:::

### Icons

The default icons used in the library are (More on the [Icons](../types/icon-config) type page):

-  **`XMark`** - the symbol `X`
-  **`uploadCloud`** - a cloud with an arrow pointing up
-  **`trash`** - a trash
-  **`chevronDown`** - an arrow pointing down
-  **`chevronLeft`** - an arrow pointing left
-  **`chevronRight`** - an arrow pointing right
-  **`doubleChevronLeft`** - an double arrow pointing left
-  **`doubleChevronRight`** - an double arrow pointing right
-  **`eye`** - an open eye
-  **`eyeDashed`** - a closed/dashed eye
-  **`magnifyingGlass`** - a magnifying glass
-  **`check`** - a tick/check symbol `✔`
-  **`infoI`** - an information `i` symbol
-  **`warningTriangle`** - a triangle with exclamation mark inside
-  **`filter`** - a funnel/filter symbol

### Assets

The default assets used in the library are (More on the [Assets](../types/asset-config) type page):

-  **`logo`** - The logo of the project (you can override it with your own logo)

### Loaders

There are no default loaders predetermined in the library.
