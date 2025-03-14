---
title: Theme
description: Theme types and their use
sidebar_position: 1
---

# Theme Type

This section documents the TypeScript types related to the theme configuration in the library.

## `Styles`

The `Styles` type defines the structure for customizable style properties.

```typescript
type Styles = {
   space: number;
   gap: number;
   borderRadius: number;
   fontFamily: string;
   transition: string;
};
```

-  **`space`**: A number representing the default space value (e.g., for padding or margins).
-  **`gap`**: A number representing the default gap value (e.g., for spacing between elements in a grid or flex layout).
-  **`borderRadius`**: A number representing the default border radius.
-  **`fontFamily`**: A string representing the default font family.
-  **`transition`**: A string representing the default CSS transition.

## `Color`

The `Color` type represents a valid CSS color value.

```typescript
type Color = `#${string}` | "transparent";
```

It can be a hexadecimal color code or the string `transparent`.

## `ColorName`

Those are the possible predefined colors in the library:

-  **`textPrimary`**: The primary text color.
-  **`textSecondary`**: The secondary text color.
-  **`label`**: The label text color (That remains light even on dark theme).
-  **`primary`**: The primary (brand) color.
-  **`secondary`**: The secondary color.
-  **`success`**: The color used for success events.
-  **`info`**: The color used for info events.
-  **`warn`**: The color used for success warning events.
-  **`error`**: The color used for success error events.
-  **`backgroundBase`**: The base background color.
-  **`backgroundSecondary`**: The secondary background color.
-  **`backgroundContent`**: The content background color.
-  **`border`**: The border color.

## `ColorTheme`

The color theme supports multiple themes that are controlled by the `data-theme` attribute on the `<html>` tag

The possible values are `light` and `dark`

## `Theme`

The `Theme` type combines `Styles` and `Colors` to define the overall theme structure.

```typescript
type Theme = {
   styles: Styles;
   colors: Record<ColorTheme, Record<ColorName, Color>>;
};
```

You can check out the [default configuration](../getting-started/configuration#theme) to see the initial values applied.

## Usage

These types are used to configure the theme of all components in the library. You can provide a custom theme by passing a `Theme` object to the `value` prop of the `<BetterHtmlProvider>` component. Check out the [Configuration](../getting-started/configuration#theme-configuration) page for more details.
