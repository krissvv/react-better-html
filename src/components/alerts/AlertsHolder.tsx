import { memo } from "react";
import { useTheme } from "react-better-core";

import { AlertsPluginOptions } from "../../plugins";

import Div from "../Div";
import Alert from "./Alert";
import { useBetterHtmlContextInternal, usePlugin } from "../BetterHtmlProvider";

function AlertsHolder() {
   const theme = useTheme();
   const alertsPlugin = usePlugin<AlertsPluginOptions>("alerts");
   const { alerts } = useBetterHtmlContextInternal();

   const pluginConfig = alertsPlugin?.getConfig() ?? {};

   const top: React.CSSProperties["top"] = pluginConfig.position === "top" ? theme.styles.gap : undefined;
   const bottom: React.CSSProperties["bottom"] = pluginConfig.position === "bottom" ? theme.styles.gap : undefined;
   const left: React.CSSProperties["left"] =
      pluginConfig.align === "left" ? theme.styles.space : pluginConfig.align === "center" ? "50%" : undefined;
   const right: React.CSSProperties["right"] = pluginConfig.align === "right" ? theme.styles.space : undefined;

   return (
      <Div.column
         position="fixed"
         top={top}
         bottom={bottom}
         left={left}
         right={right}
         gap={theme.styles.gap}
         alignItems={
            pluginConfig.align === "center" ? "center" : pluginConfig.align === "right" ? "flex-end" : undefined
         }
         transform={pluginConfig.align === "center" ? "translateX(-50%)" : undefined}
         zIndex={1000}
      >
         {alerts.map((alert) => (
            <Alert alert={alert} key={alert.id} />
         ))}
      </Div.column>
   );
}

export default memo(AlertsHolder);
