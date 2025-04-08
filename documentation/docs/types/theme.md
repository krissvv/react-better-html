---
title: Theme
description: Theme types and their use
sidebar_position: 1
---

# Theme Type

This document describes the `theme` for the application's theme configuration. It provides a structured way to manage colors, styles, and themes.

## Type Definitions

### `Styles`

```typescript
type Styles = {
   space: number;
   gap: number;
   borderRadius: number;
   fontFamily: string;
   transition: string;
};
```

This type defines the structure of the application's general styles

-  **`space`** - A number representing the default space value (e.g., for padding or margins).
-  **`gap`** - A number representing the default gap value (e.g., for spacing between elements in a grid or flex layout).
-  **`borderRadius`** - A number representing the default border radius.
-  **`fontFamily`** - A string representing the default font family.
-  **`transition`** - A string representing the default CSS transition.

### `Color`

```typescript
type Color = `#${string}` | "transparent";
```

This type represents a color value. It can be either a hexadecimal color string (e.g., `#FFFFFF`) or the string `"transparent"`.

### `ColorName`

This type defines the allowed names for colors within the theme.

-  **`textPrimary`** - The primary text color.
-  **`textSecondary`** - The secondary text color.
-  **`label`** - The label text color (That remains dark even on dark theme).
-  **`primary`** - The primary (brand) color.
-  **`secondary`** - The secondary color.
-  **`success`** - The color used for success events.
-  **`info`** - The color used for info events.
-  **`warn`** - The color used for success warning events.
-  **`error`** - The color used for success error events.
-  **`base`** - The base background color (That remains light even on dark theme).
-  **`backgroundBase`** - The base background color.
-  **`backgroundSecondary`** - The secondary background color.
-  **`backgroundContent`** - The content background color.
-  **`border`** - The border color.

### `ColorTheme`

```typescript
type ColorTheme = "light" | "dark";
```

This type defines the allowed names for color themes. it supports multiple themes that are controlled by the `data-theme` attribute on the `<html>` tag

The possible values are `light` and `dark`

### `Theme`

```typescript
type Theme = {
   styles: Styles;
   colors: Record<ColorTheme, Record<ColorName, Color>>;
};
```

This type defines the structure of a single theme, which includes both `styles` and `colors`. You can access the value of the active theme from the [useTheme](../hooks/use-theme.md) hook.

:::note
You can check out the [default configuration](../getting-started/configuration#theme) to see the initial values applied.
:::

## Usage

These types are used to configure the theme of all components in the library. You can provide a custom theme by passing a `Theme` object to the `value` prop of the `<BetterHtmlProvider>` component. Check out the [Configuration](../getting-started/configuration#theme-configuration) page for more details.
