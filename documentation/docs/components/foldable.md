---
title: Foldable
description: A collapsible component with customizable header and content
sidebar_position: 8
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Foldable Component

The `<Foldable>` component provides a collapsible container with an animated transition between open and closed states. It features a customizable header with title, description, optional icon or image, and a rotating arrow indicator.

## Basic Usage

The Foldable component can be used in both controlled and uncontrolled modes, and offers various customization options for the header and content.

<Tabs>
   <TabItem value="basic" label="Basic" default>

      ```jsx
      import { Foldable, Text } from "react-better-html";

      function App() {
         return (
            <Foldable
               // highlight-next-line
               title="Section Title"
            >
               <Text>
                  This content will be shown or hidden when the header is clicked.
                  The component animates smoothly between states.
               </Text>
            </Foldable>
         );
      }
      ```

   </TabItem>

   <TabItem value="withDescription" label="With Description">

      ```jsx
      import { Foldable, Text } from "react-better-html";

      function App() {
         return (
            <Foldable
               title="Section Title"
               // highlight-next-line
               description="A brief description of this section's content"
            >
               <Text>
                  This content will be shown or hidden when the header is clicked.
                  The component animates smoothly between states.
               </Text>
            </Foldable>
         );
      }
      ```

   </TabItem>

   <TabItem value="withIcon" label="With Icon">

      ```jsx
      import { Foldable, Text } from "react-better-html";

      function App() {
         return (
            <Foldable
               title="Section Title"
               description="A brief description of this section's content"
               // highlight-next-line
               icon="magnifyingGlass"
            >
               <Text>
                  This content will be shown or hidden when the header is clicked.
                  The component animates smoothly between states.
               </Text>
            </Foldable>
         );
      }
      ```

   </TabItem>

   <TabItem value="withImage" label="With Image">

      ```jsx
      import { Foldable, Text } from "react-better-html";

      function App() {
         return (
            <Foldable
               title="Section Title"
               description="A brief description of this section's content"
               // highlight-next-line
               image="logo"
            >
               <Text>
                  This content will be shown or hidden when the header is clicked.
                  The component animates smoothly between states.
               </Text>
            </Foldable>
         );
      }
      ```

   </TabItem>
</Tabs>

## Controlled Mode

You can control the Foldable component's open/closed state externally:

```jsx
import { Foldable, Button, Div, Text, useBooleanState } from "react-better-html";

function App() {
   // highlight-next-line
   const [isOpen, setIsOpen] = useBooleanState();

   return (
      <Div.column gap={16}>
         <Button text={isOpen ? "Close Section" : "Open Section"} onClick={setIsOpen.toggle} />

         <Foldable
            title="Controlled Foldable"
            // highlight-start
            isOpen={isOpen}
            onOpenChange={setIsOpen.toggle}
            // highlight-end
         >
            <Text>This foldable's state is controlled by the button above.</Text>
         </Foldable>
      </Div.column>
   );
}
```

## Ref API

The foldable can be controlled using a ref with the following methods:

```typescript
type FoldableRef = {
   isOpen: boolean;
   open: () => void;
   close: () => void;
   toggle: () => void;
};
```

-  **`open()`** - opens the foldable
-  **`close()`** - closes the foldable
-  **`isOpen`** - a boolean indicating whether the foldable is currently opened or not
-  **`toggle()`** - toggles the foldable's open/closed state

## Custom Header

You can fully customize the header using the `renderHeader` prop:

```jsx
import { Foldable, Div, Text, Icon, useTheme } from "react-better-html";

function App() {
   const theme = useTheme();

   return (
      <Foldable
         // highlight-start
         renderHeader={(isOpen, toggleOpen) => (
            <Div.row
               alignItems="center"
               justifyContent="space-between"
               backgroundColor={isOpen ? theme.colors.primary : theme.colors.backgroundContent}
               padding={theme.styles.space}
               cursor="pointer"
               onClick={toggleOpen}
            >
               <Text fontWeight={700}>Custom Header Design</Text>

               <Icon
                  name="chevronDown"
                  transform={`rotate(${isOpen ? 180 : 0}deg)`}
                  transition={theme.styles.transition}
               />
            </Div.row>
         )}
         // highlight-end
      >
         <Text>This foldable has a completely custom header.</Text>
      </Foldable>
   );
}
```

## Subcomponents

A number of components in the library have a _subcomponent_ feature witch is like a preset of the same component that is frequently used.

### Foldable.box

This component renders a foldable with predefined styles like the [`<Div.box>`](./div#divbox) component.

```jsx
<Foldable.box title="Box Styled Foldable" description="This subcomponent has a predefined style">
   <Text>Content goes here</Text>
</Foldable.box>
```
