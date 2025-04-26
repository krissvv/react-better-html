---
title: PageHolder
description: A component to hold page content with optional maximum width and padding.
sidebar_position: 1
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# PageHolder Component

The `<PageHolder>` component is designed to provide a consistent layout for page content within your application. It applies padding, optional maximum width, and margin to center the content.

## Basic Usage

The component wraps the main content of a page inside a `<main>` tag, ensuring the layout's semantics and look.

<Tabs>
   <TabItem value="basic" label="Basic PageHolder" default>

      ```jsx {5,11}
      import { Text, PageHolder } from "react-better-html";

      function App() {
         return (
            <PageHolder>
               <Text as="h1">Page Title</Text>

               <Text>Page content here</Text>

               // Rest of the page
            </PageHolder>
         );
      }
      ```

   </TabItem>

   <TabItem value="noMaxWidth" label="No Max Width">

      ```jsx {5,11}
      import { PageHolder } from "react-better-html";

      function App() {
         return (
            <PageHolder noMaxContentWidth>
               <Text as="h1">Full Page Width Title</Text>

               <Text>Full page width content here</Text>

               // Rest of the page
            </PageHolder>
         );
      }
      ```

      You may need to the context of the app to not be constrained by a `max-width` so you can pass a `noMaxContentWidth` prop.

   </TabItem>
</Tabs>

## Common Props

-  **`noMaxContentWidth`** - If `true`, the content will not be constrained by the maximum width defined in the [`<BetterHtmlContext>`](../getting-started/configuration#app-configuration) config
