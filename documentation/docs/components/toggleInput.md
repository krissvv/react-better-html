---
title: ToggleInput
description: A versatile component for creating checkboxes, radio buttons, and switches
sidebar_position: 15
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# ToggleInput Component

The `<ToggleInput>` component provides a unified interface for creating various toggleable input elements like checkboxes, radio buttons, and switches.

## Basic Usage

A number of components in the library have a _subcomponent_ feature witch is like a preset of the same component that is frequently used. This component can be used to render checkboxes, radio buttons, and switches by specifying the subcomponent.

:::note
The component does not have a parent element. That means you can use the component only like a subcomponent.
:::

<Tabs>
   <TabItem value="checkbox" label="Checkbox" default>

      ```jsx
      import { useState } from "react";
      import { ToggleInput } from "react-better-html";

      function App() {
         const [isChecked, setIsChecked] = useState(false);

         return (
            // highlight-next-line
            <ToggleInput.checkbox
               label="Remember me"
               checked={isChecked}
               onChange={setIsChecked}
            />
         );
      }
      ```

   </TabItem>

   <TabItem value="radio" label="Radio Button">

      ```jsx
      import { Div, Text, useState } from "react";
      import { ToggleInput } from "react-better-html";

      function App() {
         const [selectedFruit, setSelectedFruit] = useState("apple");

         return (
            <Div>
               <Text marginBottom={10}>Select a fruit</Text>

               // highlight-next-line
               <ToggleInput.radiobutton
                  text="Apple"
                  value="apple"
                  checked={selectedFruit === "apple"}
                  onChange={(checked, value) => setSelectedFruit(value)}
               />
               // highlight-next-line
               <ToggleInput.radiobutton
                  text="Banana"
                  value="banana"
                  checked={selectedFruit === "banana"}
                  onChange={(checked, value) => setSelectedFruit(value)}
               />
            </Div>
         );
      }
      ```

   </TabItem>

   <TabItem value="switch" label="Switch">

      ```jsx
      import { useState } from "react";
      import { ToggleInput } from "react-better-html";

      function App() {
         const [isSwitchOn, setIsSwitchOn] = useState(false);

         return (
            // highlight-next-line
            <ToggleInput.switch
               label="Enable Feature"
               checked={isSwitchOn}
               onChange={setIsSwitchOn}
            />
         );
      }
      ```

   </TabItem>
</Tabs>

## Common Props

All standard `<input>` attributes are valid props for this component.
