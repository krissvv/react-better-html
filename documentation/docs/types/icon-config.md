---
title: IconConfig
description: IconConfig type and its use
sidebar_position: 2
---

# IconConfig Type

This document describes the `IconConfig` which defines the configuration for SVG icons used within the application.

## Type Definitions

### `IconName`

```typescript
type IconName = "XMark" | "uploadCloud";
```

This type defines the allowed names for icons. When using the [Icon](../components/icon) component you pass a `name` props witch is of that type. You can pass other values different from the predefined names but you will need to define them in the `value` prop of the `<BetterHtmlProvider>` also. Check out the [Configuration](../getting-started/configuration#icons-configuration) page for more details.

### `IconData`

```typescript
type IconData = {
   width: number;
   height: number;
   paths: (React.ComponentProps<"path"> & { type: "fill" | "stroke" })[];
};
```

This type defines the structure of the data associated with each icon. It includes the icon's dimensions and the SVG path definitions.

-  `width`: The width of the icon in pixels.
-  `height`: The height of the icon in pixels.
-  `paths`: An array of path definitions. Each item in the array defines a single svg path and includes a `type` property.
   -  `type`: A string literal type that specifies whether the path should be filled (`"fill"`) or stroked (`"stroke"`).
   -  All standard attributes that can be used on an SVG `<path>` element in React (e.g., `d`, `fill`, `stroke`, etc.).

## Usage

These types are used to configure the icons in the library. You can provide a custom icons or override the predefined ones by passing an object to the `value` prop of the `<BetterHtmlProvider>` component. Check out the [Configuration](../getting-started/configuration#icons-configuration) page for more details.
