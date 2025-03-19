---
title: useLoaderControls
description: A hook to control the loading state of loaders within the BetterHtmlProvider context.
sidebar_position: 3
---

# useLoaderControls Hook

The `useLoaderControls` hook provides functions to start and stop loading states for loaders defined in the `BetterHtmlProvider`.

## Usage

To use the `useLoaderControls` hook, simply call it within a component.

```jsx
import { useLoaderControls, Button } from "react-better-html";

function App() {
   // highlight-next-line
   const { startLoading, stopLoading } = useLoaderControls();

   const onClickButton = () => {
      // highlight-next-line
      startLoading("testLoader");

      setTimeout(() => {
         // highlight-next-line
         stopLoading("testLoader");
      }, 2000);
   };

   return <Button text="Click me" onClick={onClickButton} />;
}
```

### Return Value

The hook returns an object with two functions:

```typescript
{
   startLoading: (loaderName: LoaderName) => boolean;
   stopLoading: (loaderName: LoaderName) => boolean;
}
```

## Notes

-  The `useLoaderControls` hook must be used within a react component.
-  The `loaderName` can be a `LoaderName` type or any string. This allows for dynamic loader names.
-  Use this hook to control the loading states of loaders defined in the [`BetterHtmlProvider`](../getting-started/configuration#loaders-configuration).
-  To access the loading state, use the [useLoader](./use-loader) hook.
