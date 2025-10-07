---
title: useAlertControls
description: A hook to create and remove alerts.
sidebar_position: 4
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# useAlertControls Hook

The `useAlertControls` hook allows you to create and remove alerts in the DOM. It is particularly useful to inform the user about events in your application.

## Usage

To use the `useAlertControls` hook, you need to enable the [`alertsPlugin`](../plugins#alerts) in the `plugins` array of the [`BetterHtmlProvider`](../getting-started/configuration).

<Tabs>
   <TabItem value="createAlert" label="Create alert" default>

      ```jsx
      import { useAlertControls, Div } from "react-better-html";

      function App() {
         // highlight-next-line
         const alertControls = useAlertControls();

         return (
            <>
               <Button
                  text="Info alert"
                  onClick={() => {
                     // highlight-start
                     alertControls.createAlert({
                        type: "info",
                        message: "Lorem ipsum"
                     });
                     // highlight-end
                  }}
               />
            </>
         );
      }
      ```

      In the above example when clicking of the button an alert will appear.

   </TabItem>

   <TabItem value="removeAlert" label="Remove alert">

      ```jsx
      import { useAlertControls, Div } from "react-better-html";

      function App() {
         // highlight-next-line
         const alertControls = useAlertControls();

         return (
            <>
               <Button
                  text="Remove alert"
                  onClick={() => {
                     // highlight-start
                     alertControls.removeAlert("3cd80fd4-d782-4f5c-8c32-1dadf20fea83");
                     // highlight-end
                  }}
               />
            </>
         );
      }
      ```

      In the above example when clicking of the button the alert with id `3cd80fd4-d782-4f5c-8c32-1dadf20fea83` will disappear.

      The id of an alert can be obtained from the return value of `alertControls.createAlert` (as referenced in the [Return Value](./use-alert-controls#return-value) section)

   </TabItem>
</Tabs>

## Return Value

The hook returns an object with the following properties:

```typescript
{
   createAlert: (alert: OmitProps<Alert, "id">) => Alert;
   removeAlert: (alertId: string) => void;
}
```

To see what is the `Alert` type, check the [Alert](../types/alert) section.

## Notes

-  The `useAlertControls` hook must be used within a react component.
