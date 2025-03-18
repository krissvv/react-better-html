---
title: AssetConfig
description: AssetConfig type and its use
sidebar_position: 3
---

# AssetConfig Type

This document describes the `asset` file, which defines the configuration for static assets (like images) used within the application.

## Type Definitions

### `AssetName`

```typescript
type AssetName = "logo";
```

This type defines the allowed names for assets. When using the [Image](../components/image) component you can pass a `name` props witch is of that type. You can pass other values different from the predefined names but you will need to define them in the `value` prop of the `<BetterHtmlProvider>` also. Check out the [Configuration](../getting-started/configuration#assets-configuration) page for more details.

## Usage

These types are used to configure the assets in the library. You can provide a custom image/asset or override the predefined ones by passing an object to the `value` prop of the `<BetterHtmlProvider>` component. Check out the [Configuration](../getting-started/configuration#assets-configuration) page for more details.
