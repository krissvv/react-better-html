import { memo } from "react";
import { Div } from "react-better-html";

function App() {
   return (
      <>
         Free text
         <Div
            onClick={() => {
               console.log("Div clicked");
            }}
         >
            react-better-html Div
         </Div>
      </>
   );
}

export default memo(App);
