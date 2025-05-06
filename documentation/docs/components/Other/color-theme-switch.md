---
title: Color Theme Switch
description: A component to render a toggle switch for changing between light and dark themes.
sidebar_position: 3
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# ColorThemeSwitch Component

The `<ColorThemeSwitch>` component provides a toggle switch for changing between light and dark themes in your application. It automatically syncs with the theme stored in localStorage and updates the HTML element's data-theme attribute.

## Basic Usage

The component renders a switch that toggles between light and dark themes.

<Tabs>
   <TabItem value="basic" label="Basic" default>

      ```jsx
      import { ColorThemeSwitch } from "react-better-html";

      function App() {
         return <ColorThemeSwitch />;
      }
      ```

   </TabItem>

   <TabItem value="withMoon" label="With Moon Icon">

      ```jsx
      import { ColorThemeSwitch } from "react-better-html";

      function App() {
         return <ColorThemeSwitch withMoon />;
      }
      ```

   </TabItem>
</Tabs>

## Subcomponents

A number of components in the library have a _subcomponent_ feature witch is like a preset of the same component that is frequently used.

### ColorThemeSwitch.withText

This component displays "Light" and "Dark" text labels on either side of the switch.

```jsx
import { ColorThemeSwitch } from "react-better-html";

function App() {
   return <ColorThemeSwitch.withText />;
}
```
