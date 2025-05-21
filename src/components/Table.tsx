import { forwardRef, memo, useCallback, ReactNode, useMemo, useState } from "react";
import styled, { css } from "styled-components";

import { ColorTheme, Theme } from "../types/theme";
import { ComponentMarginProps, ComponentPropWithRef } from "../types/components";

import Div from "./Div";
import ToggleInput, { ToggleInputProps } from "./ToggleInput";
import Image, { ImageProps } from "./Image";
import { useBetterHtmlContext, useTheme } from "./BetterHtmlProvider";
import Text from "./Text";
import Loader from "./Loader";

const defaultImageWidth = 120;

const TableStyledComponent = styled.table.withConfig({
   shouldForwardProp: (prop) => !["isStriped", "withHover", "withStickyHeader", "colorTheme", "theme"].includes(prop),
})<{
   isStriped?: boolean;
   withHover?: boolean;
   withStickyHeader?: boolean;
   colorTheme?: ColorTheme;
   theme: Theme;
}>`
   width: 100%;
   border-collapse: collapse;
   border-spacing: 0;

   tr {
      background-color: ${(props) => props.theme.colors.backgroundContent};

      &.isHeader {
         background-color: ${(props) => props.theme.colors.backgroundSecondary};
         font-weight: 700;
      }

      &.isClickable {
         cursor: pointer;
      }

      ${(props) =>
         props.isStriped
            ? css`
                 &:nth-child(even) {
                    background-color: ${props.theme.colors.backgroundSecondary};
                 }
              `
            : ""}

      ${(props) =>
         props.withHover
            ? css`
                 transition: ${props.theme.styles.transition};

                 &:not(.isHeader):hover {
                    filter: brightness(${props.colorTheme === "light" ? "0.95" : "0.85"});
                 }
              `
            : ""}

      th {
         font-size: 18px;
         text-align: left;
         padding: ${(props) => props.theme.styles.space}px;
      }

      td {
         border-top: 1px solid ${(props) => props.theme.colors.border + (props.colorTheme === "light" ? "60" : "40")};
         padding: ${(props) => props.theme.styles.gap}px ${(props) => props.theme.styles.space}px;

         &.noData {
            text-align: center;
            padding: ${(props) => props.theme.styles.space}px;
         }
      }
   }
`;

const ThStyledComponent = styled.th.withConfig({
   shouldForwardProp: (prop) => !["width", "minWidth", "maxWidth", "textAlign"].includes(prop),
})<{
   width?: React.CSSProperties["width"];
   minWidth?: React.CSSProperties["minWidth"];
   maxWidth?: React.CSSProperties["maxWidth"];
   textAlign?: React.CSSProperties["textAlign"];
}>`
   ${(props) => (props.width ? `width: ${props.width}px;` : "")}
   ${(props) => (props.minWidth ? `min-width: ${props.minWidth}px;` : "")}
   ${(props) => (props.maxWidth ? `max-width: ${props.maxWidth}px;` : "")}
   ${(props) => (props.textAlign ? `text-align: ${props.textAlign} !important;` : "")}
`;

const TdStyledComponent = styled.td.withConfig({
   shouldForwardProp: (prop) => !["width", "textAlign"].includes(prop),
})<{
   textAlign?: React.CSSProperties["textAlign"];
}>`
   ${(props) => (props.textAlign ? `text-align: ${props.textAlign} !important;` : "")}
`;

type TextColumn<DataItem> = {
   type: "text";
   keyName?: keyof DataItem;
   format?: (item: DataItem, index: number) => string;
};

type ElementColumn<DataItem> = {
   type: "element";
   render?: (item: DataItem, index: number) => ReactNode;
};

type ImageColumn<DataItem> = {
   type: "image";
   keyName?: keyof DataItem;
} & ImageProps;

type CheckboxColumn = {
   type: "checkbox";
} & ToggleInputProps<boolean>;

export type TableColumn<DataItem> = {
   label?: string;
   width?: string | number;
   minWidth?: string | number;
   maxWidth?: string | number;
   align?: "left" | "center" | "right";
} & (TextColumn<DataItem> | ElementColumn<DataItem> | ImageColumn<DataItem> | CheckboxColumn);

export type TableProps<DataItem> = {
   columns: TableColumn<DataItem>[];
   data: DataItem[];
   /** @default false */
   isStriped?: boolean;
   /** @default false */
   isLoading?: boolean;
   /** @default false */
   withStickyHeader?: boolean;
   /** @default "No data available" */
   noDataItemsMessage?: string;
   onClickRow?: (item: DataItem, index: number) => void;
   onClickAllCheckboxes?: (checked: boolean) => void;
} & ComponentMarginProps;

type TableComponentType = {
   <DataItem>(props: ComponentPropWithRef<HTMLDivElement, TableProps<DataItem>>): React.ReactElement;
};

const TableComponent: TableComponentType = forwardRef(function Table<DataItem>(
   {
      columns,
      data,
      isStriped,
      isLoading,
      withStickyHeader,
      noDataItemsMessage = "No data available",
      onClickRow,
      onClickAllCheckboxes,
      ...props
   }: TableProps<DataItem>,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const { colorTheme } = useBetterHtmlContext();
   const theme = useTheme();

   const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

   const renderCellContent = useCallback(
      (column: (typeof columns)[number], item: DataItem, index: number) => {
         switch (column.type) {
            case "text": {
               const value = column.keyName ? item[column.keyName] : undefined;

               return column.format ? column.format(item, index) : String(value ?? "");
            }

            case "element": {
               return column.render?.(item, index) ?? <></>;
            }

            case "image": {
               const { type, keyName, ...props } = column;

               const src = keyName ? (item[keyName] as string) : undefined;

               return (
                  <Image src={src} width={defaultImageWidth} borderRadius={theme.styles.borderRadius / 2} {...props} />
               );
            }

            case "checkbox": {
               const { type, onChange, ...props } = column;

               const checkedValue = checkedItems[index];

               return (
                  <ToggleInput.checkbox
                     checked={checkedValue}
                     onChange={(checked: boolean, value) => {
                        setCheckedItems((oldValue) =>
                           oldValue.map((isChecked, internalIndex) => (internalIndex === index ? checked : isChecked)),
                        );

                        onChange?.(checked, value);
                     }}
                     {...props}
                  />
               );
            }

            default: {
               return <></>;
            }
         }
      },
      [theme, checkedItems],
   );
   const onClickRowElement = useCallback(
      (item: DataItem, index: number) => {
         onClickRow?.(item, index);
      },
      [onClickRow],
   );
   const onClickAllCheckboxesElement = useCallback(
      (checked: boolean) => {
         onClickAllCheckboxes?.(checked);
         setCheckedItems(data.map(() => checked));
      },
      [onClickAllCheckboxes, data],
   );

   const everythingIsChecked = useMemo<boolean>(() => {
      return checkedItems.every((checked) => checked) && checkedItems.length === data.length;
   }, [data, checkedItems]);

   return (
      <Div
         border={`1px solid ${theme.colors.border}`}
         borderRadius={theme.styles.borderRadius * 2}
         overflow="auto"
         {...props}
         ref={ref}
      >
         <TableStyledComponent
            isStriped={isStriped}
            withHover={onClickRow !== undefined}
            withStickyHeader={withStickyHeader}
            colorTheme={colorTheme}
            theme={theme}
         >
            <thead>
               <tr className="isHeader">
                  {columns.map((column, index) => (
                     <ThStyledComponent
                        width={
                           column.type === "image" ? defaultImageWidth : column.type === "checkbox" ? 26 : column.width
                        }
                        minWidth={column.minWidth}
                        maxWidth={column.maxWidth}
                        textAlign={column.align}
                        key={column.type + column.label + index}
                     >
                        {column.label ??
                           (column.type === "checkbox" && onClickAllCheckboxes ? (
                              <ToggleInput.checkbox
                                 checked={everythingIsChecked}
                                 onChange={onClickAllCheckboxesElement}
                              />
                           ) : (
                              ""
                           ))}
                     </ThStyledComponent>
                  ))}
               </tr>
            </thead>

            <tbody>
               {isLoading ? (
                  <tr>
                     <td className="noData" colSpan={columns.length}>
                        <Loader.box />
                     </td>
                  </tr>
               ) : data.length > 0 ? (
                  data.map((item, rowIndex) => (
                     <tr
                        className={onClickRow ? "isClickable" : undefined}
                        onClick={() => onClickRowElement(item, rowIndex)}
                        key={JSON.stringify(item) + rowIndex}
                     >
                        {columns.map((column, colIndex) => (
                           <TdStyledComponent textAlign={column.align} key={column.type + column.label + colIndex}>
                              {renderCellContent(column, item, rowIndex)}
                           </TdStyledComponent>
                        ))}
                     </tr>
                  ))
               ) : (
                  <tr>
                     <td className="noData" colSpan={columns.length}>
                        <Text.unknown>{noDataItemsMessage}</Text.unknown>
                     </td>
                  </tr>
               )}
            </tbody>
         </TableStyledComponent>
      </Div>
   );
}) as any;

const Table = memo(TableComponent) as any as typeof TableComponent;

export default Table;
