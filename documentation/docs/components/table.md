---
title: Table
description: A customizable table component with support for various column types and styling options.
sidebar_position: 9
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Table Component

The `<Table>` component is a versatile React component that provides a customizable table with support for different column types, styling options, and interactive features.

## Basic Usage

The Table component requires two main props: `columns` and `data`. The `columns` prop defines the structure of the table, while the `data` prop provides the content.

<Tabs>
   <TabItem value="basic" label="Basic" default>

      ```jsx
      import { Table } from "react-better-html";

      function App() {
         return (
            <Table
               // highlight-start
               columns={[
                  {
                     type: "text",
                     label: "Name",
                     keyName: "name",
                  },
                  {
                     type: "text",
                     label: "Age",
                     keyName: "age",
                  },
                  {
                     type: "text",
                     label: "Email",
                     keyName: "email",
                  },
               ]}
               // highlight-end
               data={[
                  { name: "John Doe", age: 28, email: "john@example.com" },
                  { name: "Jane Smith", age: 32, email: "jane@example.com" },
                  { name: "Mike Johnson", age: 45, email: "mike@example.com" },
               ]}
            />
         );
      }
      ```

   </TabItem>

   <TabItem value="striped" label="Striped">

      ```jsx
      import { Table } from "react-better-html";

      function App() {
         return (
            <Table
               columns={[
                  {
                     type: "text",
                     label: "Name",
                     keyName: "name",
                  },
                  {
                     type: "text",
                     label: "Age",
                     keyName: "age",
                  },
                  {
                     type: "text",
                     label: "Email",
                     keyName: "email",
                  },
               ]}
               data={[
                  { name: "John Doe", age: 28, email: "john@example.com" },
                  { name: "Jane Smith", age: 32, email: "jane@example.com" },
                  { name: "Mike Johnson", age: 45, email: "mike@example.com" },
               ]}
               // highlight-next-line
               isStriped
            />
         );
      }
      ```

   </TabItem>
</Tabs>

## Column Props & Types

All column types support the following properties:

-  **`label`** - the column header text
-  **`width`** - the width of the column (in pixels)
-  **`align`** - the text alignment within the column

Column type-specific properties:

### Text Column

The text column type displays a text from the specified value in your data objects.

```jsx
import { Table } from "react-better-html";

function App() {
   return (
      <Table
         columns={[
            {
               // highlight-next-line
               type: "text",
               label: "Name",
               // highlight-next-line
               keyName: "name"
            },
            {
               // highlight-next-line
               type: "text",
               label: "Age",
               // highlight-start
               keyName: "age",
               format: (value) => `${value} years old`
               // highlight-end
            }
         ]}
         data={[
            { name: "John Doe", age: 28 },
            { name: "Jane Smith", age: 32 }
         ]}
      />
   );
}
```

Text columns support the following props:

-  **`type`** - must be set to `"text"`
-  **`keyName`** - the key in your data object to display
-  **`format`** - optional function to format the value before display

### Element Column

The element column allows you to render custom React elements for each cell.

```jsx
import { Table, Text } from "react-better-html";

function App() {
   return (
      <Table
         columns={[
            {
               type: "text",
               label: "Name",
               keyName: "name"
            },
            {
               // highlight-next-line
               type: "element",
               label: "Status",
               // highlight-start
               render: (item, index) => (
                  <Text color={item.status === "Active" ? "green" : "red"} fontWeight={700}>
                     {item.status}
                  </Text>
               )
               // highlight-end
            }
         ]}
         data={[
            { name: "John Doe", status: "Active" },
            { name: "Jane Smith", status: "Inactive" }
         ]}
      />
   );
}
```

Element columns support the following props:

-  **`type`** - must be set to `"element"`
-  **`render`** - a function that returns a React element, receives the data item and index as parameters

### Image Column

The image column displays images from URLs stored in your data.

```jsx
import { Table } from "react-better-html";

function App() {
   return (
      <Table
         columns={[
            {
               // highlight-next-line
               type: "image",
               label: "Avatar",
               // highlight-start
               keyName: "avatarUrl"
               width: 50,
               borderRadius: 999,
               // highlight-end
            },
            {
               type: "text",
               label: "Name",
               keyName: "name"
            }
         ]}
         data={[
            { name: "John Doe", avatarUrl: "https://example.com/john.jpg" },
            { name: "Jane Smith", avatarUrl: "https://example.com/jane.jpg" }
         ]}
      />
   );
}
```

Image columns support the following props:

-  **`type`** - must be set to `"image"`
-  **`keyName`** - optional key in your data object that contains the image URL
-  All props from the [`<Image>`](./image) component are also supported

### Checkbox Column

The checkbox column displays checkboxes that can be toggled.

```jsx
import { Table } from "react-better-html";

function App() {
   return (
      <Table
         columns={[
            {
               // highlight-start
               type: "checkbox",
               keyName: "isSelected"
               // highlight-end
            },
            {
               type: "text",
               label: "Name",
               keyName: "name"
            }
         ]}
         data={[
            { name: "John Doe", isSelected: true },
            { name: "Jane Smith", isSelected: false }
         ]}
         // highlight-next-line
         onClickAllCheckboxes={() => console.log("Toggle all checkboxes")}
      />
   );
}
```

Checkbox columns support the following props:

-  **`type`** - must be set to `"checkbox"`
-  **`keyName`** - optional key in your data object that contains the checkbox state
-  All props from the [`<ToggleInput.checkbox>`](./form/toggleInput) component are also supported

Also the component prop `onClickAllCheckboxes` can be used to render a checkbox in the header that will toggle all checkboxes at ones.

## Common Props

The Table component accepts the following props:

-  **`columns`** - array of column definitions
-  **`data`** - array of data objects
-  **`isStriped`** - whether to display alternating row colors
-  **`withStickyHeader`** - whether to make the header stick to the top when scrolling
-  **`noDataItemsMessage`** - message to display when there's no data
-  **`onClickRow`** - callback function when a row is clicked
-  **`onClickAllCheckboxes`** - callback function when the header checkbox is clicked
