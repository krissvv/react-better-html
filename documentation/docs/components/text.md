---
title: Text
description: The base for all texts in the library
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Text Component

The `Text` component is designed to provide flexible and styled text rendering. It allows you to easily apply various text styles and semantic variations.

## Basic Usage

All of the `React.CSSProperties` are valid prop with the benefit of passing just the number without unit (`px` are used by default). The library extents the CSS properties and adds all of them with `Hover` suffix that will take affect only when the component is hovered by the device pointer.

<Tabs>
   <TabItem value="basic" label="Basic" default>

      ```jsx
      import { Text } from "react-better-html";

      function App() {
         return (
            <Text color="#111111" paddingBottom={10}>
               This is a Text component.
            </Text>
         );
      }
      ```

   </TabItem>

   <TabItem value="withHover" label="With Hover" default>

      ```jsx
      import { Text } from "react-better-html";

      function App() {
         return (
            <Text color="#111111" paddingBottom={10} colorHover="#ff0000">
               This is a Text component.
            </Text>
         );
      }
      ```

      When hovering the component the text inside will become red.

   </TabItem>
</Tabs>

## Common Props

All props in HTML are a valid prop in the library.

```jsx
import { Text } from "react-better-html";

function App() {
   return (
      <Text
         title="A Text component"
         onClick={(event) => {
            console.log(event.clientX);
         }}
      >
         This is a Text component.
      </Text>
   );
}
```

### Semantic DOM

By default the `<Text>` component renders a `<p>` element in the DOM. To keep the semantic HTML you can pass a `as` props with the name of the tag you want to render

```jsx
import { Text } from "react-better-html";

function App() {
   return (
      <Text
         // highlight-next-line
         as="h1"
         paddingInline={20}
      >
         This is an h1 Text component.
      </Text>
   );
}
```

In the above example the component will be rendered as `<h1>` component in the DOM

## Subcomponents

A number of components in the library have that _subcomponent_ feature witch is like a preset of the same component that is frequently used.

### Text.unknown

This component renders with lighter color and in italic font style for `caption` use.

```jsx {8}
import { Div, Text } from "react-better-html";

function App() {
   return (
      <Div.box width="50%">
         <Text as="h2">Items:</Text>

         <Text.unknown>No items yet</Text.unknown>
      </Div.box>
   );
}
```

That renders to:

<div className="divBox w50p">
   <h2 className="text">Items:</h2>
   <p className="textUnknown">No items yet</p>
</div>

### Text.oneLine

This component renders the text in the available space and then truncates to `...`

```jsx {6-9}
import { Div, Text } from "react-better-html";

function App() {
   return (
      <Div.box>
         <Text.oneLine>
            This is really long text that is not going to be rendered fully because it is oneLine subcomponent and the
            holder component is not wide enough to render the long text
         </Text.oneLine>
      </Div.box>
   );
}
```

That renders to:

<div className="divBox">
   <p className="textOneLine">This is really long text that is not going to be rendered fully because it is oneLine subcomponent and the holder component is not wide enough to render the long text</p>
</div>
