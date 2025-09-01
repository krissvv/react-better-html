import { ComponentType, useCallback } from "react";

import { PluginName } from "../types/plugin";
import { ComponentPropWithPlugin } from "../types/components";

import { usePlugin } from "../components/BetterHtmlProvider";

export function withPlugin<ComponentProps extends object>(
   pluginName: PluginName,
   WrappedComponent: ComponentType<ComponentPropWithPlugin<ComponentProps>>,
): ComponentType<ComponentProps> {
   const WithPlugin: React.FC<ComponentProps> = useCallback(
      (props) => {
         const plugin = usePlugin(pluginName);

         if (!plugin)
            throw new Error(
               `\`${pluginName}\` must be added to the \`plugins\` prop in \`<BetterHtmlProvider>\` for the component to work.`,
            );

         return <WrappedComponent {...props} plugin={plugin} />;
      },
      [pluginName, WrappedComponent],
   );

   WithPlugin.displayName = `WithPlugin(${pluginName})`;

   return WithPlugin;
}
