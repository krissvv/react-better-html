import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThemeConfig, useTheme } from "react-better-core";
import styled from "styled-components";

import { defaultAlertDuration } from "../../constants/app";

import { AlertDuration, Alert as AlertT, AlertType } from "../../types/alert";

import { AlertsPluginOptions, defaultAlertsPluginOptions } from "../../plugins";

import Div from "../Div";
import Icon from "../Icon";
import Text from "../Text";
import Button from "../Button";
import { useAlertControls, usePlugin } from "../BetterHtmlProvider";

const StyledDiv = styled.div.withConfig({
   shouldForwardProp: (prop) => !["theme"].includes(prop),
})<{ theme: ThemeConfig }>`
   @keyframes fadeInFromLeft {
      from {
         opacity: 0;
         transform: translateX(-${(props) => props.theme.styles.space}px);
      }
      to {
         opacity: 1;
         transform: translateX(0px);
      }
   }

   @keyframes fadeInFromRight {
      from {
         opacity: 0;
         transform: translateX(${(props) => props.theme.styles.space}px);
      }
      to {
         opacity: 1;
         transform: translateX(0px);
      }
   }

   @keyframes fadeInFromTop {
      from {
         opacity: 0;
         transform: translateY(-${(props) => props.theme.styles.space}px);
      }
      to {
         opacity: 1;
         transform: translateX(0px);
      }
   }

   @keyframes fadeInFromBottom {
      from {
         opacity: 0;
         transform: translateY(${(props) => props.theme.styles.space}px);
      }
      to {
         opacity: 1;
         transform: translateY(0px);
      }
   }

   @keyframes fadeOutToLeft {
      from {
         opacity: 1;
         transform: translateX(0px);
      }
      to {
         opacity: 0;
         transform: translateX(-${(props) => props.theme.styles.space}px);
      }
   }

   @keyframes fadeOutToRight {
      from {
         opacity: 1;
         transform: translateX(0px);
      }
      to {
         opacity: 0;
         transform: translateX(${(props) => props.theme.styles.space}px);
      }
   }

   @keyframes fadeOutToTop {
      from {
         opacity: 1;
         transform: translateY(0px);
      }
      to {
         opacity: 0;
         transform: translateY(-${(props) => props.theme.styles.space}px);
      }
   }

   @keyframes fadeOutToBottom {
      from {
         opacity: 1;
         transform: translateY(0px);
      }
      to {
         opacity: 0;
         transform: translateY(${(props) => props.theme.styles.space}px);
      }
   }
`;

const minWidth = 250;
const updateInterval = 20;

const getAnimationInName = (
   position: AlertsPluginOptions["position"],
): Record<NonNullable<AlertsPluginOptions["align"]>, string> => ({
   left: "fadeInFromLeft",
   right: "fadeInFromRight",
   center: position === "top" ? "fadeInFromTop" : "fadeInFromBottom",
});

const getAnimationOutName = (
   position: AlertsPluginOptions["position"],
): Record<NonNullable<AlertsPluginOptions["align"]>, string> => ({
   left: "fadeOutToLeft",
   right: "fadeOutToRight",
   center: position === "top" ? "fadeOutToTop" : "fadeOutToBottom",
});

const getAlertDurationFromAuto = (duration: AlertDuration, alert: AlertT): number => {
   if (duration === "auto") {
      const titleLength: number = alert.title?.length ?? 0;
      const messageLength: number = alert.message?.length ?? 0;

      return Math.max(defaultAlertDuration, (titleLength + messageLength) * 30);
   }

   return duration;
};

type AlertData = {
   icon: string;
   iconColor?: string;
   backgroundColor: string;
   title: string;
};

type AlertProps = {
   alert: AlertT;
};

function Alert({ alert }: AlertProps) {
   const theme = useTheme();
   const alertControls = useAlertControls();
   const alertsPlugin = usePlugin<AlertsPluginOptions>("alerts");

   const pluginConfig = alertsPlugin?.getConfig() ?? {};

   const defaultAlertDurationNumber: number = getAlertDurationFromAuto(
      alert.duration ?? pluginConfig.defaultDuration ?? defaultAlertsPluginOptions.defaultDuration,
      alert,
   );

   const intervalRef = useRef<number>(undefined);
   const startTimeRef = useRef<number>(Date.now());
   const remainingTimeRef = useRef<number>(defaultAlertDurationNumber);
   const calledOnCloseRef = useRef<boolean>(false);

   const [isPaused, setIsPaused] = useState<boolean>(false);
   const [progress, setProgress] = useState<number>(100);
   const [isRemoved, setIsRemoved] = useState<boolean>(false);

   const startProgressTimer = useCallback(() => {
      if (intervalRef.current) {
         clearInterval(intervalRef.current);
      }

      const totalDuration = remainingTimeRef.current;

      const segmentStartTime = Date.now();

      intervalRef.current = setInterval(() => {
         const elapsedTime = Date.now() - segmentStartTime;
         const newProgress = Math.max(0, progress - (elapsedTime / totalDuration) * 100);

         setProgress(newProgress);

         if (newProgress <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);

            setIsRemoved(true);

            setTimeout(() => {
               alertControls.removeAlert(alert.id);

               if (!calledOnCloseRef.current) {
                  alert.onClose?.(alert);
                  calledOnCloseRef.current = true;
               }
            }, 0.2 * 1000 - 10);
         }
      }, updateInterval);
   }, [alert, progress]);
   const onClickCloseAlert = useCallback(() => {
      setIsRemoved(true);

      setTimeout(() => {
         alertControls.removeAlert(alert.id);

         if (!calledOnCloseRef.current) {
            alert.onClose?.(alert);
            calledOnCloseRef.current = true;
         }
      }, 0.2 * 1000 - 10);
   }, [alert]);
   const onMouseEnter = useCallback(() => {
      setIsPaused(true);

      if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = undefined;
      }

      remainingTimeRef.current = defaultAlertDurationNumber * (progress / 100);
   }, [defaultAlertDurationNumber, progress]);
   const onMouseLeave = useCallback(() => {
      setIsPaused(false);
      startProgressTimer();
   }, [startProgressTimer]);

   const alertData = useMemo<Record<AlertType, AlertData>>(
      () => ({
         info: {
            icon: "infoI",
            backgroundColor: theme.colors.info,
            title: "Info",
         },
         success: {
            icon: "check",
            backgroundColor: theme.colors.success,
            title: "Success",
         },
         warning: {
            icon: "warningTriangle",
            backgroundColor: theme.colors.warn,
            title: "Warning",
         },
         error: {
            icon: "XMark",
            backgroundColor: theme.colors.error,
            title: "Error",
         },
      }),
      [theme],
   );

   useEffect(() => {
      startTimeRef.current = Date.now();
      remainingTimeRef.current = defaultAlertDurationNumber;
      startProgressTimer();

      return () => {
         if (intervalRef.current) clearInterval(intervalRef.current);
      };
   }, [defaultAlertDurationNumber, startProgressTimer]);

   const animation = `${
      isRemoved
         ? getAnimationOutName(pluginConfig.position ?? defaultAlertsPluginOptions.position)[
              pluginConfig.align ?? defaultAlertsPluginOptions.align
           ]
         : getAnimationInName(pluginConfig.position ?? defaultAlertsPluginOptions.position)[
              pluginConfig.align ?? defaultAlertsPluginOptions.align
           ]
   } ${theme.styles.transition}`;

   return (
      <StyledDiv theme={theme}>
         <Div.box
            width="fit-content"
            maxWidth={Math.max(minWidth, pluginConfig.maxWidth ?? defaultAlertsPluginOptions.maxWidth)}
            minWidth={minWidth}
            boxShadow="0px 10px 20px #00000020"
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseEnter}
            onMouseLeave={onMouseLeave}
            animation={animation}
         >
            <Div.column gap={theme.styles.space}>
               <Div.row alignItems="center" gap={theme.styles.gap}>
                  <Div.row
                     width={36}
                     height={36}
                     alignItems="center"
                     justifyContent="center"
                     backgroundColor={alertData[alert.type].backgroundColor}
                     borderRadius={999}
                     marginTop={theme.styles.gap / 2}
                  >
                     <Icon
                        name={alertData[alert.type].icon}
                        size={18}
                        color={alertData[alert.type].iconColor ?? theme.colors.base}
                     />
                  </Div.row>

                  <Div.column flex={1} gap={theme.styles.gap / 2}>
                     <Text fontSize={18} fontWeight={700}>
                        {alert.title ?? alertData[alert.type].title}
                     </Text>

                     <Text color={theme.colors.textSecondary}>{alert.message}</Text>
                  </Div.column>

                  {pluginConfig.withCloseButton && (
                     <Button.icon icon="XMark" alignSelf="flex-start" onClick={onClickCloseAlert} />
                  )}
               </Div.row>

               {pluginConfig.withLoaderBar && (
                  <Div
                     width="100%"
                     height={5}
                     backgroundColor={theme.colors.backgroundBase}
                     borderRadius={999}
                     overflow="hidden"
                  >
                     <Div
                        width={`${progress}%`}
                        height="100%"
                        backgroundColor={alertData[alert.type].backgroundColor}
                        borderRadius={999}
                        transition={isPaused ? "none" : "width 0.02s linear"}
                     />
                  </Div>
               )}
            </Div.column>
         </Div.box>
      </StyledDiv>
   );
}

export default memo(Alert);
