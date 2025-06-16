---
title: Chip
description: A component to render customizable chip elements with text.
sidebar_position: 2
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Chip Component

The `<Chip>` component is designed to render customizable chip elements, typically used for displaying tags, categories, or small pieces of information.

## Basic Usage

The component renders a chip with text and customizable styling.

<Tabs>
   <TabItem value="basic" label="Basic" default>

      ```jsx
      import { Chip } from "react-better-html";

      function App() {
         return (
            <Chip text="Category" />
         );
      }
      ```

   </TabItem>

   <TabItem value="custom" label="Custom">

      ```jsx
      import { Chip } from "react-better-html";

      function App() {
         return (
            <Chip text="Category" fontWeight={700} color="#ffffff" backgroundColor="#ff0000" />
         );
      }
      ```

   </TabItem>
</Tabs>

There are props to control the look of the chip. Some of with are:

-  **`isSmall`** - weather to render the chip with a smaller padding
-  **`isCircle`** - weather to render the chip with a circular border radius

## Subcomponents

A number of components in the library have a _subcomponent_ feature witch is like a preset of the same component that is frequently used.

### Chip.colored

This component renders with a border and a background color.

```jsx
import { Chip } from "react-better-html";

function App() {
   return <Chip.colored text="Colored Text" color="#ff0000" />;
}
```
