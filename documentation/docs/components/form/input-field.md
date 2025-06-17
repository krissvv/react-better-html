---
title: InputField
description: A customizable input field component with various styles and functionalities.
sidebar_position: 3
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# InputField Component

The `<InputField>` component is a versatile React component that provides various styling and functional options for text input fields. It supports icons, validation states, and different input styles.

## Basic Usage

All of the `React.CSSProperties` are valid props with the benefit of passing just the number without unit (`px` are used by default). The library extends the CSS properties and adds all of them with `Hover` suffix that will take effect only when the component is hovered by the device pointer.

<Tabs>
   <TabItem value="basic" label="Basic Input" default>

      ```jsx
      import { InputField } from "react-better-html";

      function App() {
         return (
            // highlight-start
            <InputField
               label="Username"
               placeholder="Enter your username"
            />
            // highlight-end
         );
      }
      ```

   </TabItem>

   <TabItem value="withHover" label="With Hover">

      ```jsx
      import { InputField } from "react-better-html";

      function App() {
         return (
            <InputField
               label="Username"
               placeholder="Enter your username"
               // highlight-next-line
               borderColorHover="#ff0000"
            />
         );
      }
      ```

      When hovering the input field the border color will change to red.

   </TabItem>
</Tabs>

## Common Props

All standard `<input>` attributes are valid props for this component.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      <InputField
         label="Username"
         placeholder="Enter your username"
         required
         disabled
         maxLength={50}
         onChange={(event) => {
            console.log("Input value:", event.target.value);
         }}
      />
   );
}
```

### Value change

The library provides a new onChange event called `onChangeValue` that is of type `(value: string) => void`.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      <InputField
         label="Username"
         placeholder="Enter your username"
         // highlight-start
         onChangeValue={(value) => {
            console.log("Input value:", value);
         }}
         // highlight-end
      />
   );
}
```

:::note
Keep in mind that `onChange` and `onChangeValue` will both fire if passed.
:::

### Icons

The component supports both left and right icons:

-  **`leftIcon`** - Icon name to display on the left side of the input
-  **`rightIcon`** - Icon name to display on the right side of the input
-  **`onClickRightIcon`** - Callback function when the right icon is clicked

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      <InputField
         label="Username"
         placeholder="Username..."
         // highlight-start
         leftIcon="user"
         rightIcon="XMark"
         onClickRightIcon={() => {
            console.log("Right icon clicked");
         }}
         // highlight-end
      />
   );
}
```

### Validation States

The component supports various validation states:

-  **`errorText`** - Text to display when there's an error
-  **`infoText`** - Text to display as additional information
-  **`required`** - Whether the field is required or not

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      <InputField
         label="Username"
         placeholder="Enter your username"
         // highlight-start
         required
         errorText="Please enter a valid username"
         // highlight-end
      />
   );
}
```

### With Debounce

The prop `withDebounce` is required to turn on that feature. When `true`, the `onChangeValue` event will be called with a delay (debounce). You can change the delay by passing the `debounceDelay` prop. The default value for it is `0.5s` and it works for the most part.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      <InputField
         label="Address"
         placeholder="Enter your address"
         // highlight-start
         withDebounce
         onChangeValue={(value) => {
            console.log("Searched address:", value); // Will fire ones after the user stops typing
         }}
         // highlight-end
      />
   );
}
```

## Subcomponents

A number of components in the library have a _subcomponent_ feature witch is like a preset of the same component that is frequently used.

### InputField.multiline

This component renders a `<textarea>` component instead of `<input>`.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      // highlight-start
      <InputField.multiline label="Description" placeholder="Enter your description" />
      // highlight-end
   );
}
```

### InputField.email

This component renders a ready for email input field with placeholder and auto-fills.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <InputField.email
         onChangeValue={(value) => {
            console.log("email:", value);
         }}
      />
   );
}
```

### InputField.password

This component renders a ready for password input field with placeholder and auto-fills. It includes an eye button for unhiding the text.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <InputField.password
         onChangeValue={(value) => {
            console.log("password:", value);
         }}
      />
   );
}
```

### InputField.search

This component renders a ready for search input field with placeholder and auto-fills. It includes an icon to indicate the search functionality.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <InputField.search
         onChangeValue={(value) => {
            console.log("Search value:", value);
         }}
      />
   );
}
```

### InputField.phoneNumber

This component renders an input field with dropdown to pick the country code. Local country code is preselected by default.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <InputField.phoneNumber
         onChangeValue={(value) => {
            console.log("Ready phone number:", value);
         }}
      />
   );
}
```

### InputField.date

This component renders an input field with calendar to pick a date.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <InputField.date
         onChangeValue={(value) => {
            console.log("Ready date:", value);
         }}
      />
   );
}
```

### InputField.time

This component renders an input field with time picker to pick a time.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <InputField.time
         onChangeValue={(value) => {
            console.log("Ready time:", value);
         }}
      />
   );
}
```

### InputField.dateTime

This component renders an input field with calendar and time picker to pick a date and time.

```jsx
import { InputField } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <InputField.dateTime
         onChangeValue={(value) => {
            console.log("Ready date and time:", value);
         }}
      />
   );
}
```
