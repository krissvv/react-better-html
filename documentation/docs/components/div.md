---
title: Div
description: The core building block of everything
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import BetterHtmlProvider from '../../../src/components/BetterHtmlProvider';
import Div from '../../../src/components/Div';

# Div Component

The `<Div>` component is a highly versatile container element that provides enhanced styling capabilities and supports various layout options. It's designed to be as close to a standard HTML `div` element as possible, but with additional features and simplified syntax.

## Basic Usage

All of the `React.CSSProperties` are valid prop with the benefit of passing just the number without unit (`px` are used by default).

```jsx
import { Div } from "react-better-html";

function App() {
   return (
      <Div padding={20} backgroundColor="#f8f8f8">
         This is a Div component.
      </Div>
   );
}
```

## Common Props

All props in HTML are a valid prop in the library.

```jsx
import { Div } from "react-better-html";

function App() {
   return (
      <Div
         title="A Div component"
         onClick={(event) => {
            console.log(event.clientX);
         }}
      >
         This is a Div component.
      </Div>
   );
}
```

### Value click

The library provides a new click event called `onClickWithValue` that is of type `(value: Value) => void` and is used together with the `value` prop. The `Value` type is generic and will automatically inherit the value prop type.

```jsx
import { Div } from "react-better-html";

function App() {
   return (
      <Div
         // highlight-next-line
         value={12}
         onClickWithValue={(value) => {
            console.log(value); // Will log to the console "12"
         }}
      >
         This is a Div component.
      </Div>
   );
}
```

:::note
Keep in mind that `onClick` and `onClickWithValue` will both fire if passed.
:::

### Tab Accessed

If `isTabAccessed` prop is passed the component will be included in the keyboard `Tab` key list and will register clicks when `Enter` key is pressed.

```jsx
import { Div } from "react-better-html";

function App() {
   return (
      <Div
         // highlight-next-line
         isTabAccessed
         onClick={(event) => {
            console.log(event.clientX);
         }}
      >
         This is a Div component.
      </Div>
   );
}
```

### Semantic DOM

By default the `<Div>` component renders (you guessed it) a `div` element in the DOM. To keep the semantic HTML you can pass an `as` props with the name of the tag you want to render

```jsx
import { Div } from "react-better-html";

function App() {
   return (
      <Div
         // highlight-next-line
         as="main"
         paddingInline={20}
      >
         This is a Div component.
      </Div>
   );
}
```

In the above example the component will be rendered as `<main>` component in the DOM

## Subcomponents

A number of components in the library have that _subcomponent_ feature witch is like a preset of the same component that is frequently used.

### Div.row

This component is by default `display: flex` with `flex-direction: row`.

```jsx
import { Div } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <Div.row alignItems="center">
         <Div>Child 1</Div>
         <Div>Child 2</Div>
         <Div>Child 3</Div>
         // highlight-next-line
      </Div.row>
   );
}
```

### Div.column

This component is by default `display: flex` with `flex-direction: column`.

```jsx
import { Div } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <Div.column alignItems="center">
         <Div>Child 1</Div>
         <Div>Child 2</Div>
         <Div>Child 3</Div>
         // highlight-next-line
      </Div.column>
   );
}
```

:::tip
Both `Div.row` and `Div.column` have a prop called `invertFlexDirection` that is of type `boolean`. When passed it inverts the flex direction. It is mostly used for creating a responsive design. Best used with [useMediaQuery](../hooks/use-media-query) hook.
:::

### Div.grid

This component is by default `display: grid` and can accept grid-specific props.

```jsx
import { Div } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <Div.grid gridTemplateColumn="1fr 1fr">
         <Div>Child 1</Div>
         <Div>Child 2</Div>
         <Div>Child 3</Div>
         <Div>Child 4</Div>
         // highlight-next-line
      </Div.grid>
   );
}
```

### Div.box

This component renders a content box with predefined styles

```jsx
import { Div } from "react-better-html";

function App() {
   return (
      // highlight-next-line
      <Div.box>This is a Div component.</Div.box>
   );
}
```

<BetterHtmlProvider>

<Div.box>This is a Div component.</Div.box>

</BetterHtmlProvider>
