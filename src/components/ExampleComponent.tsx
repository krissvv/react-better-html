import { memo } from "react";

import { ComponentPropWithPlugin } from "../types/components";

import { withPlugin } from "../utils/withPlugin";

type ExampleComponentProps = {
   test?: string;
};

function ExampleComponent({ test, plugin }: ComponentPropWithPlugin<ExampleComponentProps>) {
   return (
      <div>
         <h1>
            Example Component with Router Plugin: {test} {plugin.name}
         </h1>
      </div>
   );
}

export default memo(withPlugin<ExampleComponentProps>("react-router-dom", ExampleComponent));
