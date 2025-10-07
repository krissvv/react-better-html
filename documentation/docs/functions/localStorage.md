---
title: LocalStorage
description: Functions that use the localStorage plugin.
sidebar_position: 4
---

## `generateLocalStorage`

It takes a generic type to configure the localStorage keys and their types. When they are set or removed, the browser localStorage is updated.

```ts title="utils/localStorage.ts"
export const LocalStorage = generateLocalStorage<{
   user: {
      name: string;
      email: string;
   };
   jwtToken: string;
}>();
```

In the following example `user` and `jwtToken` are the available keys in the localStorage. If `encryption` is enabled, the values are encrypted before being stored in the localStorage and decrypted when retrieved.

:::info
The [`localStorage`](../plugins#localstorage) plugin is required for the `generateLocalStorage` function to work.
:::

We advice to create a `localStorage.ts` file inside a `utils` folder and export the `LocalStorage` object from it.

### Methods

#### `setItem` - write to the localStorage

```ts
LocalStorage.setItem("user", {
   name: "John Doe",
   email: "john.doe@example.com"
});
```

#### `getItem` - read from the localStorage

```ts
LocalStorage.getItem("user");
```

#### `removeItem` - remove a key from the localStorage

```ts
LocalStorage.removeItem("user");
```

#### `removeAllItems` - remove all keys from the localStorage

```ts
LocalStorage.removeAllItems();
```
