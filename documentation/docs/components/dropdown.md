---
title: Dropdown
description: A customizable dropdown component with search functionality and keyboard navigation.
sidebar_position: 7
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Dropdown Component

The `<Dropdown>` component is a versatile React component that provides a customizable dropdown menu with search functionality, keyboard navigation, and various styling options.

## Basic Usage

All of the `React.CSSProperties` are valid props with the benefit of passing just the number without unit (`px` are used by default). The library extends the CSS properties and adds all of them with `Hover` suffix that will take effect only when the component is hovered by the device pointer.

<Tabs>
   <TabItem value="basic" label="Basic Dropdown" default>

      ```jsx
      import { Dropdown } from "react-better-html";

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
      import { Dropdown } from "react-better-html";

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

The component supports search functionality through the `withSearch` prop. The component also has the event `onChangeSearch` that returns the typed value inside the input field. This event only fires if `withSearch` prop is `true`.

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
         // highlight-start
         onChangeSearch={(value) => {
            console.log("Input field value:", value); // What the user has typed in the field
         }}
         // highlight-end
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

### With Debounce

The prop `withDebounce` is required to turn on that feature. When `true`, the `onChangeSearch` event will be called with a delay (debounce). You can change the delay by passing the `debounceDelay` prop. The default value for it is `0.5s` and it works for the most part.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      <Dropdown
         label="Address"
         placeholder="Enter your address"
         options={[
            { value: 1, label: "Address 1" },
            { value: 2, label: "Address 2" },
            { value: 3, label: "Address 3" }
         ]}
         // highlight-start
         withDebounce
         onChangeValue={(value) => {
            console.log("Searched address:", value); // Will fire immediately when the user selects an option
         }}
         onChangeSearch={(value) => {
            console.log("Input field value:", value); // Will fire ones after the user stops typing
         }}
         // highlight-end
      />
   );
}
```

The component can also be configured to show loading of the components when the debounce is active ond/or `debounceIsLoading` prop is passed. This is especially useful when the content of the options is rendered dynamically from an API, for example. A `debounceMinimumSymbolsRequired` can also be passed for a required minimum length of the search query.

### Remove the clear button

the prop `withoutClearButton` will remove the render of the `X` button inside the dropdown and will prevent the value to get back as `undefined` ones an option is selected.

## Keyboard Navigation

The component supports keyboard navigation:

-  Up/Down arrows to navigate through options
-  Enter to select the focused option
-  Escape to close the dropdown
-  Enter and/or Space to toggle the dropdown (when not in search mode)
