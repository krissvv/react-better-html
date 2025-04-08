---
title: usePageScroll
description: Get the current scroll position of the website.
sidebar_position: 6
---

# usePageScroll Hook

The `usePageScroll()` hook provides a way to track the current scroll position of the website. It returns an object containing the `scrollX` and `scrollY` properties, which are updated whenever the window is scrolled in real time.

## Usage

```jsx
import { usePageScroll, Div, Text } from "react-better-html";

function App() {
   // highlight-next-line
   const { scrollX, scrollY } = usePageScroll();

   return (
      <Div>
         <Text>Webpage scroll x: {scrollX}px</Text>
         <Text>Webpage scroll y: {scrollY}px</Text>
      </Div>
   );
}
```

## Return Value

The `usePageScroll()` hook returns an object with the following properties:

```typescript
{
   scrollX: number; // Current scroll x of the webpage in pixels.
   scrollY: number; // Current scroll y of the webpage in pixels.
}
```
