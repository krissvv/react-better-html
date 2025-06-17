---
title: Form
description: A layout component for forms, integrating with the useForm hook
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Form Component

The `<Form>` component provides a structured layout for forms, seamlessly integrating with the [`useForm`](../hooks/use-form) hook. It handles the form submission, displays submit and optional cancel buttons.

## Basic Usage

The component renders a `<form>` element. Wrap your form fields within the `<Form>` component.

```jsx
import { Form, InputField } from "react-better-html";

function LoginForm() {
   return (
      // highlight-next-line
      <Form submitButtonText="Login" gap={10} onSubmit={(event) => {}}>
         <InputField label="Username" name="username" />
         <InputField.password label="Password" name="password" />
         // highlight-next-line
      </Form>
   );
}
```

## Common Props

-  **`form`** - the object returned by the [`useForm`](../hooks/use-form) hook.
-  **`submitButtonText`** - the text to display on the submit button. If provided, a submit button will be rendered.
-  **`submitButtonLoaderName`** - the name of the loader to display on the submit button.
-  **`submitButtonId`** - the `id` attribute for the submit button.
-  **`submitButtonIsDisabled`** - a boolean to manually disable the submit button. This prop takes precedence over the automatic disabling based on required fields.
-  **`actionButtonsLocation`** - controls the horizontal alignment of the action buttons (submit and cancel).
-  **`gap`** - the gap between the child elements within the form.
-  **`isSubmitting`** - a boolean to manually control the loading state of the submit button. This is typically managed by the `isSubmitting` state returned by the `useForm` hook.
-  **`isDestructive`** - if `true`, the submit button will be rendered using the `Button.destructive` variant.
-  **`withDividers`** - if `true`, a [`<Divider.horizontal />`](../other/divider.md) will be rendered between the child elements.
-  **`onClickCancel`** - if provided, a "Cancel" button will be rendered. The callback function will be called when the button is clicked.
-  **`onSubmit`** - a `onSubmit` handler for the form. If provided, this will be used instead of the `onSubmit` function from the `form` prop.
