---
title: Divider
description: A component to render vertical and horizontal dividers.
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Divider Component

The `<Divider>` component provides a simple way to render vertical and horizontal dividers with customizable styles. It is designed to visually separate content within your application.

## Basic Usage

The component offers two types of dividers: `vertical` and `horizontal`. You can customize the width of the line with the `width` prop. `backgroundColor` will change the color of the divider and the `paddingBlock` will put some space above and below.

<Tabs>
   <TabItem value="vertical" label="Vertical" default>

      ```jsx
      import { Div, Text, Divider } from 'react-better-html';

      function App() {
         return (
            <Div.row height={200} alignItems="center" gap={20}>
               <Text textAlign="center">Content Left</Text>

               // highlight-next-line
               <Divider.vertical />

               <Text textAlign="center">Content Right</Text>
            </Div.row>
         );
      }
      ```

      You can set a height for the divider if you do not want it to span the `100%` of the parent.

   </TabItem>

   <TabItem value="horizontal" label="Horizontal">

      ```jsx
      import { Div, Text, Divider } from 'react-better-html';

      function App() {
         return (
            <Div.column gap={20}>
               <Text textAlign="center">Content Top</Text>

               // highlight-next-line
               <Divider.horizontal text="OR" />

               <Text textAlign="center">Content Bottom</Text>
            </Div.column>
         );
      }
      ```

      You can set a `text` prop that will render a text in the middle of the divider as shown in the example above. You can customize it by passing a `textColor` props.

   </TabItem>
</Tabs>
