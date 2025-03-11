import { memo } from "react";

import { Div, Text, Loader } from "../../src";

function App() {
   return (
      <>
         <Text as="h1">Hello</Text>
         <Div.box>App</Div.box>
         <Loader />
      </>
   );
}

export default memo(App);
