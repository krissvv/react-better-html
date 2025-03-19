---
title: Button
description: A customizable button component with various styles and functionalities.
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Button Component

The `<Button>` component is a versatile React component that provides various styling and functional options. It supports icons, images, loading states, and different button styles.

## Basic Usage

All of the `React.CSSProperties` are valid prop with the benefit of passing just the number without unit (`px` are used by default). The library extents the CSS properties and adds all of them with `Hover` suffix that will take affect only when the component is hovered by the device pointer.

<Tabs>
   <TabItem value="text" label="Text Button" default>

      ```jsx
      import { Button } from 'react-better-html';

      function App() {
         return (
            <Button
               // highlight-next-line
               text="Click me"
               onClick={(event) => {
                  console.log("Button was clicked. Event:", event);
               }}
            />
         );
      }
      ```

   </TabItem>

   <TabItem value="icon" label="Icon Button" >

      ```jsx
      import { Button } from 'react-better-html';

      function App() {
         return (
            <Button
               text="Icon Button"
               // highlight-next-line
               icon="XMark"
               onClick={(event) => {
                  console.log("Button was clicked. Event:", event);
               }}
            />
         );
      }
      ```

   </TabItem>

   <TabItem value="image" label="Image Button" >

      ```jsx
      import { Button } from 'react-better-html';

      function App() {
         return (
            <Button
               text="Image Button"
               // highlight-next-line
               image="logo"
               onClick={(event) => {
                  console.log("Button was clicked. Event:", event);
               }}
            />
         );
      }
      ```

   </TabItem>

   <TabItem value="loading" label="Loading Button" >

      ```jsx
      import { useState, useEffect } from "react";
      import { Button } from 'react-better-html';

      function App() {
         // highlight-next-line
         const [isLoading, setIsLoading] = useState(false)

         useEffect(()=>{
            if (!isLoading) return;

            setTimeout(() => {
               setIsLoading(false);
            }, 2000)
         },[isLoading])

         return (
            <Button
               text="Loading Button"
               // highlight-next-line
               isLoading={isLoading}
               onClick={() => setIsLoading(true)}
            />
         );
      }
      ```

   </TabItem>

   <TabItem value="withHover" label="With Hover" >

      ```jsx
      import { Button } from 'react-better-html';

      function App() {
         return (
            <Button
               text="Hover Button"
               // highlight-next-line
               backgroundColorHover="#ff0000"
               onClick={(event) => {
                  console.log("Button was clicked. Event:", event);
               }}
            />
         );
      }
      ```

      When hovering the component, the background color will change to red.

   </TabItem>
</Tabs>

## Common Props

All standard `<button>` attributes are valid props in the library.

```jsx
import { Button } from "react-better-html";

function App() {
   return (
      <Button
         text="Click me"
         backgroundColor="#ff0000"
         title="A `click me` button"
         onClick={(event) => {
            console.log("Button was clicked. Event:", event);
         }}
      />
   );
}
```

### Value click

The library provides a new click event called `onClickWithValue` that is of type `(value: Value) => void` and is used together with the `value` prop. The `Value` type is generic and will automatically inherit the `value` prop type.

```jsx
import { Button } from "react-better-html";

function App() {
   return (
      <Button
         text="Click me"
         // highlight-start
         value={12}
         onClickWithValue={(value) => {
            console.log(value); // Will log to the console "12"
         }}
         // highlight-end
      />
   );
}
```

:::note
Keep in mind that `onClick` and `onClickWithValue` will both fire if passed.
:::

### Icon

The `icon` prop allows you to specify an icon to display on the button.

```jsx
import { Button } from "react-better-html";

function App() {
   return <Button text="Close" icon="XMark" />;
}
```

There are props to control the icon style:

-  **`icon`** - the name of the icon of type [IconName](../types/icon-config#iconname)
-  **`iconPosition`** - weather to put the icon on the `left` or on the `right` side of the text (defaults to `left`)
-  **`iconColor`** - the color of the icon (defaults to the color of the text)
-  **`iconSize`** - the size of the icon (default to the `font-side` of the text)

### Image

The `image` prop allows you to specify an image to display on the button.

```jsx
import { Button } from "react-better-html";

function App() {
   return <Button text="react-better-html" image="logo" />;
}
```

There are props to control the image style:

-  **`image`** - the name of the image of type [AssetName](../types/asset-config#assetname)
-  **`imagePosition`** - weather to put the image on the `left` or on the `right` side of the text (defaults to `left`)
-  **`imageWidth`** - the width of the image (default to the `font-side` of the text)
-  **`imageHeight`** - the height of the image

### Loading State

The `isLoading` prop allows you to display a loading indicator on the button. You can take advantage of the internal component state and pass a `loaderName` prop. it is controlled by the

<Tabs>
   <TabItem value="isLoading" label="isLoading" default>

      ```jsx
         import { Button } from "react-better-html";

         function App() {
            return (
               <Button
                  text="Loading"
                  // highlight-next-line
                  isLoading
               />
            );
         }
      ```

   </TabItem>

   <TabItem value="loaderName" label="loaderName">

      ```jsx
         import { Button } from "react-better-html";

         function App() {
            return (
               <Button
                  text="Loading"
                  // highlight-next-line
                  loaderName="creatingItem"
               />
            );
         }
      ```

      The loader with name `creatingItem` has a value of `true` and thus the button will render in loading state. You can control the value of the loader from the [useLoaderControls](../hooks/use-loader-controls) hook and if you need only the value of the loader itself you can use [useLoader](../hooks/use-loader) hook.

   </TabItem>
</Tabs>

### Disabled State

The `disabled` prop allows you to disable the button.

```jsx
import { Button } from "react-better-html";

function App() {
   return (
      <Button
         text="Click me"
         disabled
         onClick={(event) => {
            console.log("Button was clicked. Event:", event);
         }}
      />
   );
}
```

## Subcomponents

A number of components in the library have a _subcomponent_ feature witch is like a preset of the same component that is frequently used.

### Button.secondary

This component is styles like a secondary button.

```jsx
import { Div, Button } from "react-better-html";

function App() {
   return (
      <Div.row gap={10}>
         <Button text="Start now" />
         // highlight-next-line
         <Button.secondary text="Reed more" />
      </Div.row>
   );
}
```

### Button.destructive

This component is with a destructive style (red background).

```jsx
import { Div, Button } from "react-better-html";

function App() {
   return (
      <Div.row gap={10}>
         <Button text="Keep reading" />
         // highlight-next-line
         <Button.destructive text="Close" />
      </Div.row>
   );
}
```

### Button.icon

This component is with an icon only and has e a circular chape.

```jsx
import { Button } from "react-better-html";

function App() {
   // highlight-next-line
   return <Button.icon icon="XMark" />;
}
```

### Button.upload

This component triggers a file upload and has an upload icon. It also handles the files with the `onUpload` prop.

```jsx
import { Button } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <Button.upload
         text="Pick file"
         // highlight-start
         onUpload={(files) => {
            console.log("Selected files:", files);
         }}
         // highlight-end
      />
   );
}
```
