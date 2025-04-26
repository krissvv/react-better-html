---
title: Label
description: A component to render a label with optional required indicator and error styling.
sidebar_position: 6
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Label Component

The `<Label>` component is designed to render `<label>` html element. It provides options for displaying a required indicator and error styling.

## Basic Usage

The component renders a label with optional required indicator and error styling.

<Tabs>
   <TabItem value="basic" label="Basic" default>

      ```jsx
      import { Label } from "react-better-html";

      function App() {
         return (
            <Label text="Username" />
         );
      }
      ```

   </TabItem>

   <TabItem value="required" label="Required">

      ```jsx
      import { Label } from "react-better-html";

      function App() {
         return (
            <Label text="Email" required />
         );
      }
      ```

   </TabItem>

   <TabItem value="error" label="Error" default>

      ```jsx
      import { Label } from "react-better-html";

      function App() {
         return (
            <Label text="Password" isError />
         );
      }
      ```

   </TabItem>
</Tabs>

## Common Props

```typescript
type LabelProps = {
   text?: string;
   required?: boolean;
   isError?: boolean;
};
```

-  **`text`** - the text to display in the label
-  **`required`** - if `true`, an asterisk is appended to the label to indicate it is required
-  **`isError`** - if `true`, the label is styled with an error color
