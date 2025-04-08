---
title: Other
description: Any other function that might be useful in an app development
sidebar_position: 1
---

## `generateRandomString`

It takes one required param `stringLength` and return a random string with the provided length. The second param is optional and is for options for the generated string.

```ts
generateRandomString(6); // Returns d17uIn
generateRandomString(20); // Returns YZQhBVyeyTceEaEBk0jq
```

:::note
The possible symbols are `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
:::

### Options

Here are the possible options that can be configured for the generating a random string

```ts
{
   includeCapitalLetters: boolean; // Defaults to true
   includeLowerLetters: boolean; // Defaults to true
   includeNumbers: boolean; // Defaults to true
   dashSections: number; // Defaults to 1
}
```

examples:

```ts
generateRandomString(6, {
   includeCapitalLetters: false,
   includeLowerLetters: false
}); // Returns 835166

generateRandomString(5, {
   dashSections: 3
}); // Returns g-Z-1

generateRandomString(11, {
   dashSections: 2
}); // Returns YZQhB-VyeyT
```
