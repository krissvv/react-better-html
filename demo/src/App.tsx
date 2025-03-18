import { memo } from "react";

import { Div, Text, Loader, Icon, Image } from "../../src";

function App() {
   return (
      <>
         <Text as="h1">Hello</Text>
         <Div.box>App</Div.box>
         <Loader />
         <Icon name="XMark" />
         <Image name="logo" width={300} />
      </>
   );
}

export default memo(App);
