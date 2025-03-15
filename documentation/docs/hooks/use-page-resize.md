---
title: usePageResize
description: Get the current width and height of the window.
sidebar_position: 3
---

# usePageResize Hook

The `usePageResize()` hook provides a way to track the current width and height of the browser window. It returns an object containing the `width` and `height` properties, which are updated whenever the window is resized in real time.

## Usage

```jsx
import { usePageResize, Div, Text } from "react-better-html";

function App() {
   // highlight-next-line
   const { width, height } = usePageResize();

   return (
      <Div>
         <Text>Window width: {width}px</Text>
         <Text>Window height: {height}px</Text>
      </Div>
   );
}
```

## Return Value

The `usePageResize()` hook returns an object with the following properties:

```typescript
{
   width: number; // Current width of the window in pixels.
   height: number; // Current height of the window in pixels.
}
```
