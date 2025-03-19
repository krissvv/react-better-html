---
title: Image
description: All the assets and images in the library
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Image Component

The `<Image>` component is a React component that renders image assets. It supports styling, sizing, and events.

## Basic Usage

All of the `React.CSSProperties` are valid prop with the benefit of passing just the number without unit (`px` are used by default). The library extents the CSS properties and adds all of them with `Hover` suffix that will take affect only when the component is hovered by the device pointer.

The component can render images from your asset configuration using the `name` prop, or from a direct URL using the `src` prop.

<Tabs>
   <TabItem value="asset" label="Asset Name" default>

      ```jsx
      import { Image } from 'react-better-html';

      function App() {
         return (
            <Image name="logo" alt="Application logo" />
         );
      }
      ```

   </TabItem>

   <TabItem value="src" label="Direct URL" default>

      ```jsx
      import { Image } from 'react-better-html';

      function App() {
         return (
            <Image src="https://picsum.photos/200/300" alt="Picsum photos image" />
         );
      }
      ```

   </TabItem>

   <TabItem value="withHover" label="With Hover" default>

      ```jsx
      import { Image } from 'react-better-html';

      function App() {
         return (
            <Image name="logo" alt="Application logo" transformHover="scale(1.1)" />
         );
      }
      ```

      When hovering the component, the image will scale up.

   </TabItem>
</Tabs>

:::tip
Ensure that the `assets` object in the `<BetterHtmlProvider>` value prop contains the asset you want to use (except the already included in the library). Check out the [Configuration](../getting-started/configuration#assets-configuration) page for more details.
:::

## Common Props

All standard `<img>` attributes are valid props in the library.

```jsx
import { Image } from "react-better-html";

function App() {
   return (
      <Image
         name="logo"
         alt="Application logo"
         borderRadius={10}
         onClick={(event) => {
            console.log(event.clientX);
         }}
      />
   );
}
```

### Asset Name

The `name` prop allows you to specify the asset to render by its name, as defined in your `<BetterHtmlProvider>` asset configuration.

```jsx
import { Image } from "react-better-html";

function App() {
   return <Image name="logo" />;
}
```

### Source URL

The `src` prop allows you to specify the image source directly using a URL.

```jsx
import { Image } from "react-better-html";

function App() {
   return <Image src="https://picsum.photos/200/300" />;
}
```

## Subcomponents

A number of components in the library have a _subcomponent_ feature witch is like a preset of the same component that is frequently used.

### Image.profileImage

This component is by default `object-fit: cover`. It also does not accept `with` and `height` props but `size` props that keeps the shape always a circle

```jsx
import { Image } from "react-better-html";

function App() {
   return <Image.profileImage src="https://picsum.photos/200/300" alt="user profile image" />;
}
```
