---
title: useMediaQuery
description: The hook that makes everything responsive and mobile-friendly
sidebar_position: 5
---

# useMediaQuery Hook

The `useMediaQuery()` hook provides a convenient way to check the current screen size against predefined breakpoints. It returns boolean values indicating whether the screen width falls within specific ranges. Use this hook to create responsive layouts and apply conditional styles based on screen size.

## Usage

```jsx
import { useTheme, useMediaQuery, Div, Text } from "react-better-html";

function App() {
   const theme = useTheme();
   // highlight-next-line
   const mediaQuery = useMediaQuery();

   return (
      <Div padding={theme.styles.space}>
         {mediaQuery.size600 ? (
            <Text>Screen size is 600px or less.</Text>
         ) : (
            <Text>Screen size is greater than 600px.</Text>
         )}
      </Div>
   );
}
```

## Return Value

The hook returns an object with boolean properties representing various screen size breakpoints.

-  The breakpoint values are fixed and represent common screen sizes.

```typescript
{
   size320: boolean; // Width <= 320px
   size400: boolean; // Width <= 400px
   size500: boolean; // Width <= 500px
   size600: boolean; // Width <= 600px
   size700: boolean; // Width <= 700px
   size800: boolean; // Width <= 800px
   size900: boolean; // Width <= 900px
   size1000: boolean; // Width <= 1000px
   size1100: boolean; // Width <= 1100px
   size1200: boolean; // Width <= 1200px
   size1300: boolean; // Width <= 1300px
   size1400: boolean; // Width <= 1400px
   size1500: boolean; // Width <= 1500px
   size1600: boolean; // Width <= 1600px
}
```
