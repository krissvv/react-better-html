# react-better-html

A component library for react that is as close to plane html as possible

![NPM Version](https://img.shields.io/npm/v/react-better-html)
![GitHub Repo stars](https://img.shields.io/github/stars/krissvv/react-better-html?style=flat)
![GitHub package.json version](https://img.shields.io/github/package-json/v/krissvv/react-better-html)
![NPM Type Definitions](https://img.shields.io/npm/types/react-better-html)<br/>
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/krissvv/react-better-html/document-deploy.yml)
![GitHub last commit](https://img.shields.io/github/last-commit/krissvv/react-better-html)
![NPM Downloads](https://img.shields.io/npm/dm/react-better-html)<br/>
![NPM License](https://img.shields.io/npm/l/react-better-html)<br/>
![React dep](https://img.shields.io/badge/React-v19-9b6499)

# 🚧 Work in progress 🚧

🔴 The library is not yet ready for use - development is actively in progress 🔴

## Documentation

You can fined the full documentation on the home page of the official [Docs](https://krissvv.github.io/react-better-html) website.

## Requirements

-  [React](https://react.dev) version 19.0 or above.

The library uses [styles-components](https://styled-components.com) under the hood to create all of the components in the library. `styles-components` is a peer dependency and will be installed automatically when downloading the `react-better-html`.

## Installation

To install `react-better-html` run the following command in your project directory:

```bash
npm install react-better-html
```

## Configuration

The `<BetterHtmlProvider>` component should wrap your application's root component to apply the configuration.

```jsx
import { createRoot } from "react-dom/client";
import { BetterHtmlProvider } from "react-better-html";

import App from "./App";

const root = document.getElementById("root");
createRoot(root).render(
   <BetterHtmlProvider>
      <App />
   </BetterHtmlProvider>,
);
```

This is enough for the components to work with the default configurations that the library comes with. They can be overridden when passing `value` prop to the `<BetterHtmlProvider>` tag.

## Problems?

Ask for help on [Stack Overflow](https://stackoverflow.com/questions/ask), on our [GitHub repository](https://github.com/krissvv/react-better-html/issues/new) or contact the contributors.
