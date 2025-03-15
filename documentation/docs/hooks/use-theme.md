---
title: useTheme
description: The hook to the global theme constants
sidebar_position: 1
---

# useTheme Hook

The `useTheme()` hook allows you to access the current global theme configuration within your app. This is particularly useful for applying theme-based styles dynamically.

## Usage

```jsx
import { useTheme, Div } from "react-better-html";

function App() {
   const theme = useTheme();

   return (
      <Div
         textAlign="center"
         // highlight-start
         color={theme.colors.textPrimary}
         backgroundColor={theme.colors.primary}
         padding={theme.styles.space}
         // highlight-end
      >
         This component uses the primary color from the theme as background color.
      </Div>
   );
}
```

The hook returns the current theme object, which comes from the [BetterHtmlProvider](../getting-started/configuration#theme-configuration) and is of type [Theme](../types/theme)

## Notes

-  Make sure your component is wrapped within a `<BetterHtmlProvider>` to access the theme.
-  The `useTheme()` hook will re-render the component whenever the theme context changes. This ensures that your styles are always up-to-date with the current theme.

:::note
It is best to do not change the values of the `<BetterHtmlProvider>` dynamically throughout the lifespan of an app. it will work but will affect the performance of your application.
:::
