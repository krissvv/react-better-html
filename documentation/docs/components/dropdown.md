---
title: Dropdown
description: A customizable dropdown component with search functionality and keyboard navigation.
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Dropdown Component

The `<Dropdown>` component is a versatile React component that provides a customizable dropdown menu with search functionality, keyboard navigation, and various styling options.

## Basic Usage

All of the `React.CSSProperties` are valid props with the benefit of passing just the number without unit (`px` are used by default). The library extends the CSS properties and adds all of them with `Hover` suffix that will take effect only when the component is hovered by the device pointer.

<Tabs>
   <TabItem value="basic" label="Basic Dropdown" default>

      ```jsx
      import { Dropdown } from 'react-better-html';

      function App() {
         return (
            <Dropdown
               label="Select an option"
               options={[
                  {  value: 1, label: "Option 1" },
                  {  value: 2, label: "Option 2" },
                  {  value: 3, label: "Option 3" },
               ]}
               onChange={(value) => {
                  console.log("Selected value:", value);
               }}
            />
         );
      }
      ```

   </TabItem>

   <TabItem value="withHover" label="With Hover" default>

      ```jsx
      import { Dropdown } from 'react-better-html';

      function App() {
         return (
            <Dropdown
               label="Select an option"
               options={[
                  {  value: 1, label: "Option 1" },
                  {  value: 2, label: "Option 2" },
                  {  value: 3, label: "Option 3" },
               ]}
               onChange={(value) => {
                  console.log("Selected value:", value);
               }}
               // highlight-next-line
               borderColorHover="#ff0000"
            />
         );
      }
      ```

      When hovering the component the text inside will change to red.

   </TabItem>
</Tabs>

## Common Props

All standard `<div>` attributes are valid props for this component.

```jsx
import { Dropdown } from "react-better-html";

function App() {
   return (
      <Dropdown
         label="Select an option"
         options={[
            { value: 1, label: "Option 1" },
            { value: 2, label: "Option 2" },
            { value: 3, label: "Option 3" }
         ]}
         value={1}
         placeholder="Choose an option"
         required
         disabled
         errorText="Please select an option"
         infoText="Select one of the available options"
         onChange={(value) => {
            console.log("Selected value:", value);
         }}
      />
   );
}
```

### Options

The `options` prop accepts an array of objects with the following structure:

```typescript
type DropdownOption<Value, Data = unknown> = {
   label: string;
   value: Value;
   disabled?: boolean;
   searchValues?: string[];
   data?: Data;
};
```

-  **`label`** - The text to display.
-  **`value`** - The value to be selected.
-  **`disabled`** - Whether the option is disabled.
-  **`searchValues`** - Additional search terms for the option.
-  **`data`** - Any data that need to be passed down and used in the `renderOption` prop.

### Search Functionality

The component supports search functionality through the `withSearch` prop:

```jsx
import { Dropdown } from "react-better-html";

function App() {
   return (
      <Dropdown
         label="Select a person"
         options={[
            {
               value: "john",
               label: "John Doe",
               // highlight-next-line
               searchValues: ["johny", "johnny"]
            },
            {
               value: "jane",
               label: "Jane Smith",
               // highlight-next-line
               searchValues: ["jenny"]
            }
         ]}
         // highlight-next-line
         withSearch
         onChange={(value) => {
            console.log("Selected value:", value);
         }}
      />
   );
}
```

When `withSearch` is enabled:

-  The input field becomes editable.
-  Options are filtered based on the search query.
-  Search matches both the label and searchValues (if exists).

### Custom Option Rendering

You can customize how each option is rendered using the `renderOption` prop:

```jsx
import { Div, Text, Dropdown, useTheme } from "react-better-html";

function App() {
   const theme = useTheme();

   return (
      <Dropdown
         label="Select an option"
         options={[
            { value: 1, label: "Option 1" },
            { value: 2, label: "Option 2" },
            { value: 3, label: "Option 3" }
         ]}
         // highlight-start
         renderOption={(option) => (
            <Div.row alignItems="center" gap={theme.styles.gap}>
               <Text as="span">🎯</Text>
               <Text as="span">{option.label}</Text>
            </Div.row>
         )}
         // highlight-end
         onChange={(value) => {
            console.log("Selected value:", value);
         }}
      />
   );
}
```

## Keyboard Navigation

The component supports keyboard navigation:

-  Up/Down arrows to navigate through options
-  Enter to select the focused option
-  Escape to close the dropdown
-  Enter and/or Space to toggle the dropdown (when not in search mode)
