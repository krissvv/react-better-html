import { memo } from "react";

import Div from "../../src/components/Div";

function App() {
   return (
      <>
         <Div>App</Div>
         <Div.box>App</Div.box>
      </>
   );
}

export default memo(App);
