---
title: Loader
description: A customizable loader component.
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Loader Component

The `<Loader>` component is a versatile React component that provides various styling and functional options for displaying loading indicators. It supports different styles.

## Basic Usage

The component can render a standard circular loader with customizable size and color.

```jsx
import { Loader } from "react-better-html";

function App() {
   return <Loader size={32} color="#ff0000" />;
}
```

## Common Props

All standard `<div>` attributes are valid props for this component as it uses the [`<Div>`](./div) component internally.

## Subcomponents

### Loader.box

This component renders a loader with a text underneath.

```jsx
import { Loader } from "react-better-html";

function App() {
   return <Loader.box text="Loading Data..." />;
}
```

Some of the props to customize this loader are:

-  `text`- the text to display below the loader (defaults to `Loading...`)
-  The `color` prop will change bot the loader's and the text's color

### Loader.text

This component renders a loader with an inlined text.

```jsx
import { Loader } from "react-better-html";

function App() {
   return <Loader.text text="Loading..." size={24} color="orange" />;
}
```

Some of the props to customize this loader are:

-  `text`- the text to display below the loader (defaults to `Loading...`)
-  The `color` prop will change bot the loader's and the text's color
