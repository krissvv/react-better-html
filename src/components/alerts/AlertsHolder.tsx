import { memo, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "react-better-core";

import { AlertsPluginOptions } from "../../plugins";

import { useModalDialogs } from "../../utils/hooks";

import Div from "../Div";
import Alert from "./Alert";
import { useBetterHtmlContextInternal, usePlugin } from "../BetterHtmlProvider";

type MovableParent = Element & {
   moveBefore?: (node: Node, child: Node | null) => void;
};

const moveNodeInto = (parent: MovableParent, node: Node) => {
   if (node.parentNode === parent) return;

   if (typeof parent.moveBefore === "function" && node.isConnected && parent.isConnected) {
      try {
         parent.moveBefore(node, null);
         return;
      } catch {}
   }

   parent.appendChild(node);
};

function AlertsHolder() {
   const theme = useTheme();
   const alertsPlugin = usePlugin<AlertsPluginOptions>("alerts");
   const { alerts } = useBetterHtmlContextInternal();
   const { topmostModalDialog } = useModalDialogs();

   const [container] = useState<HTMLDivElement | undefined>(() =>
      typeof document !== "undefined" ? document.createElement("div") : undefined,
   );

   useLayoutEffect(() => {
      if (!container) return;

      moveNodeInto(topmostModalDialog ?? document.body, container);
   }, [container, topmostModalDialog]);
   useLayoutEffect(() => {
      if (!container) return;

      return () => {
         container.remove();
      };
   }, [container]);

   const pluginConfig = alertsPlugin?.getConfig() ?? {};

   const top: React.CSSProperties["top"] = pluginConfig.position === "top" ? theme.styles.gap : undefined;
   const bottom: React.CSSProperties["bottom"] = pluginConfig.position === "bottom" ? theme.styles.gap : undefined;
   const left: React.CSSProperties["left"] =
      pluginConfig.align === "left" ? theme.styles.space : pluginConfig.align === "center" ? "50%" : undefined;
   const right: React.CSSProperties["right"] = pluginConfig.align === "right" ? theme.styles.space : undefined;

   return container ? (
      createPortal(
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
         </Div.column>,
         container,
      )
   ) : (
      <></>
   );
}

export default memo(AlertsHolder);
