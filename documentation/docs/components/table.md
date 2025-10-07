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

## Common Props

The Table component accepts the following props:

-  **`columns`** - array of column definitions
-  **`data`** - array of data objects
-  **`isStriped`** - whether to display alternating row colors
-  **`withStickyHeader`** - whether to make the header stick to the top when scrolling
-  **`noDataItemsMessage`** - message to display when there's no data
-  **`onClickRow`** - callback function when a row is clicked
-  **`onClickAllCheckboxes`** - callback function when the header checkbox is clicked
-  **`pageSize`** - the number of items to display per page
-  **`pageCount`** - the total number of pages. Used for when the rest of the items in the table are not present.
-  **`onChangePage`** - callback function when the page changes. Used together with `pageSize` and `pageCount`.
-  **`onChangeFilter`** - callback function when the filter changes
-  **`onChangeFilterDataValue`** - callback function when the filter are applied and the data array is filtered.

## Column Props & Types

All column types support the following properties:

-  **`label`** - the column header text
-  **`width`** - the width of the column (in pixels)
-  **`minWidth`** - the minimum width of the column (in pixels)
-  **`maxWidth`** - the maximum width of the column (in pixels)
-  **`align`** - the text alignment within the column
-  **`clickStopPropagation`** - whether to stop the click event from propagating to the parent element
-  **`filter`** - the filter type for the column. Learn more in the [Filters](./table#column-filters) section.

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
               format: (value) => `${value} years old`,
               getTextProps: {
                  color: "#ff0000"
               }
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
-  **`getTextProps`** - optional object or function to get props for the rendered text component inside the table cell. All props from the [`<Text>`](./text) component are supported

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
-  **`render`** - a function that returns a React element, receives the item and index as parameters

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
               getImageProps: (item) => ({
                  src: item.avatarUrl,
                  width: 50,
                  height: 50,
                  borderRadius: 999
               })
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
-  **`getImageProps`** - optional object or function to get props for the rendered image component inside the table cell. All props from the [`<Image>`](./image) component are supported

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
-  **`getToggleInputProps`** - optional object or function to get props for the rendered toggle input component inside the table cell. All props from the [`<ToggleInput.checkbox>`](./form/toggleInput) component are supported

:::tip
The table prop `onClickAllCheckboxes` can be used to render a checkbox in the header that will toggle all checkboxes at ones.
:::

### Expand Column

The expand column displays an arrow that can be toggled to show/hide additional content.

```jsx
import { Table, Text } from "react-better-html";

function App() {
   return (
      <Table
         columns={[
            {
               // highlight-start
               type: "expand",
               render: (item) => <Text>{item.isSelected ? "Selected" : "Not selected"}</Text>
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
      />
   );
}
```

Expand columns support the following props:

-  **`type`** - must be set to `"expand"`
-  **`onlyOneExpanded`** - whether to allow only one row to be expanded at a time
-  **`render`** - function to render the content inside the expanded row
-  **`onExpand`** - optional callback function to be called when a row is expanded
-  **`onCollapse`** - optional callback function to be called when a row is collapsed

:::warning
The table prop `isInsideTableExpandRow` must be set when rendering a `<Table>` component inside a `Expand` column. It is set to the inner `<Table>` component.
:::

## Column Filters

### Number filter

```jsx
import { Table } from "react-better-html";

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
               type: "text",
               label: "Age",
               keyName: "age",
               // highlight-start
               filter: "number",
               getValue: (item) => item.age
               // highlight-end
            }
         ]}
         data={[
            { name: "John Doe", age: 23 },
            { name: "Jane Smith", age: 28 }
         ]}
      />
   );
}
```

Number filter support the following props:

-  **`filter`** - must be set to `"number"`
-  **`getValue`** - function to get the value for the filter check

### Date and Date-Time filter

```jsx
import { Table } from "react-better-html";

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
               type: "text",
               label: "Age",
               keyName: "age",
               // highlight-start
               filter: "date",
               getValue: (item) => item.age
               // highlight-end
            }
         ]}
         data={[
            { name: "John Doe", dateBorn: "2002-01-18" },
            { name: "Jane Smith", dateBorn: "1997-07-02" }
         ]}
      />
   );
}
```

Date and Date-Time filters support the following props:

-  **`filter`** - must be set to either `"date"` or `"date-time"`
-  **`getValue`** - function to get the value for the filter check
-  **`presets`** - optional array of presets to be displayed in the filter modal UI

### List filter

```jsx
import { Table } from "react-better-html";

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
               type: "text",
               label: "Age",
               // highlight-start
               keyName: "age",
               filter: "list",
               getValueForList: (item) => ({
                  label: `Age ${item.age}`,
                  value: item.age
               })
               // highlight-end
            }
         ]}
         data={[
            { name: "John Doe", age: 23 },
            { name: "Jane Smith", age: 28 }
         ]}
      />
   );
}
```

List filter support the following props:

-  **`filter`** - must be set to `"list"`
-  **`withTotalNumber`** - whether to show the total number of items in the filter modal
-  **`withSearch`** - whether to render a search input in the filter modal
-  **`getValueForList`** - function to get the array of items to be displayed in the list as possible filter values
