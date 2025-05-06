---
title: useForm
description: A powerful hook for managing form state, validation, and submission
sidebar_position: 7
---

# useForm Hook

The `useForm` hook provides a comprehensive solution for managing form state, handling input changes, validating form data, and submitting forms. It simplifies the process of working with forms and reduces boilerplate code.

## Basic Usage

To use the `useForm` hook, you need to provide an object with `defaultValues` for your form fields and optionally `requiredFields`, a `validate` function, and an `onSubmit` function.

```jsx
import { InputField, Form, useForm } from "react-better-html";

function LoginForm() {
   // highlight-start
   const form = useForm({
      defaultValues: {
         username: "",
         password: "",
         rememberMe: false
      },
      requiredFields: ["username", "password"],
      onSubmit: (values) => {
         console.log("Form submitted with values:", values);
      }
   });
   // highlight-end

   return (
      <Form form={form} submitButtonText="Login" gap={10}>
         <InputField label="Username" {...form.getInputFieldProps("username")} />
         <InputField.password label="Password" {...form.getInputFieldProps("password")} />
         <ToggleInput.checkbox label="Remember me" {...form.getCheckboxProps("rememberMe")} />
      </Form>
   );
}
```

## Hook Options

-  **`defaultValues`** - an object defining the initial values for each form field. The keys of this object should correspond to the names of your form fields
-  **`requiredFields`** - an array of keys representing the fields that are required. This will set the `required` prop on the corresponding input components
-  **`validate`** - a function that takes the current form values as input and returns an object containing validation errors. The keys of the returned object should correspond to the field names with errors, and the values should be the error messages. If there are no errors, an empty object should be returned.
-  **`onSubmit`** - a function that will be called when the form is submitted and validation (if provided) passes. It receives an object containing the current form values.

:::tip
All of the field names and value type are TypeScript safe and will suggest an autofill.
:::

## Hook Return Values

-  **`values`** - an object containing the current values of all form fields.
-  **`errors`** - an object containing any validation errors. The keys correspond to the field names with errors, and the values are the error messages.
-  **`isSubmitting`** - a boolean state indicating whether the form is currently being submitted.
-  **`setFieldValue`** - a function to programmatically update the value of a single form field (when used it clears its error).
-  **`setFieldsValue`** - a function to programmatically update the values of multiple form fields (when used it clears their errors).
-  **`getInputFieldProps`** - a function that takes a field name and returns the necessary props to be spread onto an `<InputField>` component.
-  **`getTextAreaProps`** - a function that takes a field name and returns the necessary props to be spread onto a `<InputField.multiline>` component.
-  **`getDropdownFieldProps`** - a function that takes a field name and returns the necessary props to be spread onto a `<Dropdown>` component.
-  **`getCheckboxProps`** - a function that takes a field name and returns the necessary props to be spread onto a `<ToggleInput.checkbox>` component.
-  **`getRadioButtonProps`** - a function that takes a field name and a specific value for the radio button and returns the necessary props to be spread onto a `<ToggleInput.radiobutton>` component.
-  **`getSwitchProps`** - a function that takes a field name and returns the necessary props to be spread onto a `<ToggleInput.switch>` component.
-  **`focusField`** - a function that takes a field name and focuses the corresponding input field (if it exists and is a standard HTML input element).
-  **`onSubmit`** - an event handler function that should be attached to the `<form>` element's `onSubmit` event. It prevents the default form submission, triggers validation, and calls the `onSubmit` callback if validation passes.
-  **`reset`** - a function to reset the form values to their `defaultValues` and clear any errors.
-  **`requiredFields`** - the array of required fields passed to the hook.
-  **`isDirty`** - a boolean indicating if the user changed something from teh initialValues.

## Usage Notes

-  The `useForm` hook is designed to work seamlessly with `react-better-html` form-related components (`InputField`, `Dropdown`, `ToggleInput`, ...).
-  Ensure that the `name` attribute of your input fields implicitly matches the keys in your `defaultValues` and the arguments you pass to the `getInputFieldProps`, `getTextAreaProps`, etc.
-  The `getInputFieldProps` automatically determines the input type from the `type` attribute of the referenced input element.
-  The `onSubmit` function handles both synchronous and asynchronous `onSubmit` callbacks.
-  The `validate` function is optional and if used should return an object with key-value pair per field.
-  Use the `focusField` function to programmatically focus on a specific input field.

## Example (Complete Form)

```jsx
import { useForm, InputField, Form, ToggleInput, getFormErrorObject } from "react-better-html";

function ContactForm() {
   const form = useForm({
      defaultValues: {
         name: "",
         email: "",
         message: "",
         subscribe: false
      },
      requiredFields: ["name", "email", "message"],
      validate: (values) => {
         const errors = getFormErrorObject(values);

         if (!values.name) errors.name = "Name is required";

         if (!values.email) errors.email = "Email is required";
         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Invalid email format";

         if (!values.message) errors.message = "Message is required";

         return errors;
      },
      onSubmit: async (values) => {
         console.log("Contact form submitted:", values);

         await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

         alert("Message sent");
      }
   });

   return (
      <Form form={form} submitButtonText="Send Message">
         <InputField label="Name" {...form.getInputFieldProps("name")} />
         <InputField.email label="Email" {...form.getInputFieldProps("email")} />
         <InputField.multiline label="Message" {...form.getTextAreaProps("message")} />

         <ToggleInput.checkbox label="Subscribe to newsletter" {...form.getCheckboxProps("subscribe")} />
      </Form>
   );
}

export default ContactForm;
```

:::info
The library provides `getFormErrorObject()` function that returns typed empty object for you to populate it with possible errors and return at the end of the `validate` function in the hook.
:::
