---
title: Modal
description: A customizable modal component with header, title, and content.
sidebar_position: 6
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Modal Component

The `<Modal>` component provides a flexible way to create modal dialogs within your application. It supports customizable headers and provides imperative control through a `ref`.

## Basic Usage

The modal can be controlled imperatively using a `ref`.

<Tabs>
   <TabItem value="basic" label="Basic" default>

      ```jsx
      import { useRef } from "react";
      import { Div, Text, Button, Modal, ModalRef } from "react-better-html";

      function App() {
         // highlight-next-line
         const myModalRef = useRef<ModalRef>(null);

         return (
            <Div>
               <Button
                  text="Open Modal"
                  onClick={() => {
                     // highlight-next-line
                     myModalRef.current?.open();
                  }}
               />

               // highlight-start
               <Modal title="My Modal" ref={myModalRef}>
                  <Text>Modal content here</Text>
               </Modal>
               // highlight-end
            </Div>
         );
      }
      ```

   </TabItem>

   <TabItem value="custom" label="Customizable" default>

      ```jsx
      import { useRef } from "react";
      import { Div, Text, Button, Modal, ModalRef } from "react-better-html";

      function App() {
         // highlight-next-line
         const myModalRef = useRef<ModalRef>(null);

         return (
            <Div>
               <Button
                  text="Open Modal"
                  onClick={() => {
                     // highlight-next-line
                     myModalRef.current?.open();
                  }}
               />

               // highlight-start
               <Modal
                  headerBackgroundColor="#0000ff"
                  title="My Modal"
                  titleColor="#ff0000"
                  description="This is my modal for reference"
                  descriptionColor="#00ff00"
                  ref={myModalRef}
               >
                  <Text>Modal content here</Text>
               </Modal>
               // highlight-end
            </Div>
         );
      }
      ```

   </TabItem>
</Tabs>

## Common Props

-  **`maxWidth`** - the maximum width of the modal. Defaults to 30% smaller than `app.contentMaxWidth` from the [`<BetterHtmlContext>`](../getting-started/configuration#app-configuration) config.
-  **`title`** - this prop enables the header of the modal and renders a title for the modal.
-  **`titleColor`** - the color of the title text.
-  **`description`** - this prop requires `text` prop and renders a description text underneath it.
-  **`descriptionColor`** - the color of the description text.
-  **`headerBackgroundColor`** - the background color of the modal's header.
-  **`onOpen`** - a callback function that is called when the modal is opened.
-  **`onClose`** - a callback function that is called when the modal is closed.
-  **`children`** - the content of the modal.

## Ref API

The modal can be controlled using a ref with the following methods:

```typescript
type ModalRef = {
   open: () => void;
   close: () => void;
   isOpened: boolean;
};
```

-  **`open()`** - opens the modal
-  **`close()`** - closes the modal
-  **`isOpened`** - a boolean indicating whether the modal is currently opened or not

## Subcomponents

A number of components in the library have a _subcomponent_ feature witch is like a preset of the same component that is frequently used.

### Modal.confirmation

This component is a confirmation modal with `Confirm` and `Cancel` buttons.

```jsx {5,16-21}
import { useRef } from "react";
import { Div, Button, Modal, ModalRef } from "react-better-html";

function App() {
   const confirmationModalRef = useRef < ModalRef > null;

   return (
      <Div>
         <Button
            text="Continue"
            onClick={() => {
               confirmationModalRef.current?.open();
            }}
         />

         <Modal.confirmation
            onConfirm={() => {
               console.log("Confirmed!");
            }}
            ref={confirmationModalRef}
         />
      </Div>
   );
}
```

### Modal.destructive

This component is a destructive modal with `Delete` and `Cancel` buttons.

```jsx {5,16-21}
import { useRef } from "react";
import { Div, Button, Modal, ModalRef } from "react-better-html";

function App() {
   const deleteModalRef = useRef < ModalRef > null;

   return (
      <Div>
         <Button
            text="Delete"
            onClick={() => {
               deleteModalRef.current?.open();
            }}
         />

         <Modal.destructive
            onConfirm={() => {
               console.log("Deleted!");
            }}
            ref={deleteModalRef}
         />
      </Div>
   );
}
```
