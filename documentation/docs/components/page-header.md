---
title: PageHeader
description: A component to render a page/section header with an optional image, title, description and more.
sidebar_position: 13
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# PageHeader Component

The `<PageHeader>` component is designed to render a consistent header for pages and/or sections within your application. It supports an optional image, title, description and more.

## Basic Usage

The component renders a header with a title and description.

<Tabs>
   <TabItem value="basic" label="Basic" default>

      ```jsx
      import { PageHeader } from "react-better-html";

      function App() {
         return (
            <PageHeader title="Addresses" description="All available addresses listed bellow" />
         );
      }
      ```

   </TabItem>

   <TabItem value="image" label="With Image">

      ```jsx
      import { PageHeader } from "react-better-html";

      function App() {
         return (
            <PageHeader
               // highlight-next-line
               imageUrl="https://picsum.photos/200/300"
               title="Addresses"
               description="All available addresses listed bellow"
            />
         );
      }
      ```

   </TabItem>

   <TabItem value="rightElement" label="With Actions">

      ```jsx
      import { Button, PageHeader } from "react-better-html";

      function App() {
         return (
            <PageHeader
               title="Addresses"
               description="All available addresses listed bellow"
               // highlight-next-line
               rightElement={<Button text="Add New" icon="XMark" />}
            />
         );
      }
      ```

   </TabItem>
</Tabs>

## Common Props

```typescript
type PageHeaderProps = {
   imageUrl?: string;
   imageSize?: number;
   title?: string;
   titleAs?: TextAs;
   titleRightElement?: React.ReactNode;
   description?: string;
   textAlign?: React.CSSProperties["textAlign"];
   rightElement?: React.ReactNode;
   lightMode?: boolean;
} & Pick<ComponentMarginProps, "marginBottom">;
```

-  **`imageUrl`** - a URL of an image to display in the header
-  **`imageSize`** - the size of the image in pixels
-  **`title`** - the title text
-  **`titleAs`** - the HTML tag to use for the title (e.g., "h1", "h2", ...)
-  **`titleRightElement`** - react element to render right after the title text
-  **`description`** - the description text
-  **`textAlign`** - the text alignment for the title and description
-  **`rightElement`** - react element to display in the right end of the component
-  **`lightMode`** - if true, uses white text colors
