---
title: Formatters
description: Any format functions that transform a value to a ready to use.
sidebar_position: 1
---

## `formatPhoneNumber`

It takes one param `phoneNumber` and return a formatted version of it. The phone number requires to have a country code to be properly formatted.

```ts
formatPhoneNumber("+393401234567"); // Returns +39 340 123 4567
formatPhoneNumber("+16205298875"); // Returns +1 (620)529-8875
```
