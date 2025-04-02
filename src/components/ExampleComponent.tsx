import { memo } from "react";

import { ComponentPropWithPlugin } from "../types/components";

import { withPlugin } from "../utils/withPlugin";

type ExampleComponentProps = {
   test?: string;
};

function ExampleComponent({ test, plugin }: ComponentPropWithPlugin<ExampleComponentProps>) {
   const { Link } = plugin.components || {};

   return (
      <div>
         <h1>Example Component with Router Plugin: {test}</h1>
         <Link to="/">Go to Home Page</Link>
      </div>
   );
}

export default memo(withPlugin<ExampleComponentProps>("react-router-dom", ExampleComponent));
