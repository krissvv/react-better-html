---
title: FormRow
description: A layout component for organizing form elements in rows, with an optional title and description.
sidebar_position: 2
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# FormRow Component

The `<FormRow>` component is designed to structure form elements within a row layout. It adapts its layout based on screen size.

## Basic Usage

The component arranges its children in a row, with responsive gap behavior.

<Tabs>
   <TabItem value="basic" label="Basic" default>

      ```jsx
      import { FormRow, InputField } from "react-better-html";

      function App() {
         return (
            // highlight-next-line
            <FormRow>
               <InputField label="First Name" />
               <InputField label="Last Name" />
            // highlight-next-line
            </FormRow>
         );
      }
      ```

   </TabItem>

   <TabItem value="oneItemOnly" label="One Item Only">

      ```jsx
      import { FormRow, InputField } from "react-better-html";

      function App() {
         return (
            // highlight-next-line
            <FormRow oneItemOnly>
               <InputField label="Full Name" />
            </FormRow>
         );
      }
      ```

   </TabItem>
</Tabs>

:::tip
The component is responsive and will render on two lines if in mobile mode.
:::

## Subcomponents

A number of components in the library have a _subcomponent_ feature witch is like a preset of the same component that is frequently used.

### `FormRow.withTitle`

Renders a form row with an optional icon, title, and description at the beginning of the row, followed by the one element inside.

```jsx
import { FormRow, InputField } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <FormRow.withTitle icon="user" title="Personal Information" description="Enter your personal details">
         <InputField label="Full Name" />
         // highlight-next-line
      </FormRow.withTitle>
   );
}
```

The component has the option to render `save` and `clear` buttons if the value is changed. You can pass `withActions` prop that will render the `save` button. To capture the events `onClickSave` and `onClickReset` props can be passed. The `onClickReset` will render `clear` button.

```jsx
import { FormRow, InputField } from "react-better-html";

function App() {
   return (
      <FormRow.withTitle
         icon="user"
         title="Personal Information"
         description="Enter your personal details"
         // highlight-start
         withActions
         onClickSave={() => {
            console.log("Save button clicked");
         }}
         // highlight-end
      >
         <InputField label="Full Name" />
      </FormRow.withTitle>
   );
}
```
