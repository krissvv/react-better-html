import { forwardRef, JSX, memo, useCallback } from "react";
import styled from "styled-components";

import { isMobileDevice } from "../constants";

import { ComponentStyle } from "../types/components";
import { OmitProps } from "../types/app";

import { useStyledComponentStyles, useComponentPropsWithPrefix, useComponentPropsWithoutStyle } from "../utils/hooks";

const DivElement = styled.div.withConfig({
   shouldForwardProp: (prop) => !["normalStyle", "hoverStyle"].includes(prop),
})<{ normalStyle: ComponentStyle; hoverStyle: ComponentStyle }>`
   ${(props) => props.normalStyle as any}

   &:hover {
      ${(props) => props.hoverStyle as any}
   }
`;

type DivProps<Value> = {
   value?: Value;
   as?: keyof JSX.IntrinsicElements;
   isTabAccessed?: boolean;
   onClickWithValue?: (value: Value) => void;
} & OmitProps<React.ComponentProps<"div">, "style"> &
   ComponentStyle;

type DivComponent = {
   <Value>(props: DivProps<Value> & { ref?: React.Ref<HTMLDivElement> }): React.ReactElement;
   row: <Value>(
      props: DivProps<Value> & {
         ref?: React.Ref<HTMLDivElement>;
         invertFlexDirection?: boolean;
      },
   ) => React.ReactElement;
   column: <Value>(
      props: DivProps<Value> & {
         ref?: React.Ref<HTMLDivElement>;
         invertFlexDirection?: boolean;
      },
   ) => React.ReactElement;
   grid: <Value>(props: DivProps<Value> & { ref?: React.Ref<HTMLDivElement> }) => React.ReactElement;
};

const Div: DivComponent = forwardRef(function Div<Value>(
   { value, as, isTabAccessed, onClickWithValue, role, onClick, onKeyDown, ...props }: DivProps<Value>,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const styledComponentStyles = useStyledComponentStyles(props);
   const dataProps = useComponentPropsWithPrefix(props, "data");
   const ariaProps = useComponentPropsWithPrefix(props, "aria");
   const restProps = useComponentPropsWithoutStyle(props);

   const onClickElement = useCallback(
      (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
         onClick?.(event);
         onClickWithValue?.(value as any);
      },
      [onClick, onClickWithValue, value],
   );
   const onKeyDownElement = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
         onKeyDown?.(event);

         if (!isTabAccessed) return;

         if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.currentTarget.click();
         }
      },
      [onKeyDown, isTabAccessed],
   );

   return (
      <DivElement
         as={as}
         tabIndex={isTabAccessed && !isMobileDevice ? 0 : undefined}
         role={role ?? (onClick ? "button" : undefined)}
         onClick={onClickElement}
         onKeyDown={onKeyDownElement}
         {...styledComponentStyles}
         {...dataProps}
         {...ariaProps}
         {...restProps}
         ref={ref}
      />
   );
}) as any;

export default memo(Div);
