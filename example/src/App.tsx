import { memo } from "react";
import { Div } from "react-better-html";

function App() {
   return (
      <>
         Free text
         <Div>react-better-html Div</Div>
      </>
   );
}

export default memo(App);
