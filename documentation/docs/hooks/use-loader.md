---
title: useLoader
description: A hook to access the loading state of a specific loader
sidebar_position: 2
---

# useLoader Hook

The `useLoader` hook allows you to access the loading state of a specific loader defined in the `BetterHtmlProvider` context. This is particularly useful for managing loading states in your application.

## Usage

To use the `useLoader` hook, you need to provide the name of the loader as defined in your `BetterHtmlProvider`'s loaders configuration.

```jsx
import { useLoader, Div } from "react-better-html";

function App() {
   // highlight-next-line
   const isLoading = useLoader("testLoader");

   return <Div.box>{isLoading ? "Loading..." : "Content Loaded"}</Div.box>;
}
```

In the above example the variable `isLoading` is boolean and can be used in the component as needed.

## Notes

-  The `useLoader` hook must be used within a react component.
-  The `loaderName` must correspond to a key in the `loaders` object provided to the [`BetterHtmlProvider`](../getting-started/configuration#loaders-configuration).
-  If the `loaderName` is not provided or does not exist, the hook returns `false`.
-  This hook is read-only. To control the loading state, use the [useLoaderControls](./use-loader-controls) hook.
