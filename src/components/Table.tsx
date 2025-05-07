import { forwardRef, memo, useCallback, ReactNode, useMemo } from "react";
import styled, { css } from "styled-components";

import { Theme } from "../types/theme";
import { ComponentMarginProps, ComponentPropWithRef } from "../types/components";

import Div from "./Div";
import ToggleInput, { ToggleInputProps } from "./ToggleInput";
import Image, { ImageProps } from "./Image";
import { useTheme } from "./BetterHtmlProvider";
import Text from "./Text";

const defaultImageWidth = 120;

const TableStyledComponent = styled.table.withConfig({
   shouldForwardProp: (prop) => !["isStriped", "withHover", "withStickyHeader", "theme"].includes(prop),
})<{
   isStriped?: boolean;
   withHover?: boolean;
   withStickyHeader?: boolean;
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
                 transition: ${(props) => props.theme.styles.transition};

                 &:not(.isHeader):hover {
                    background-color: ${props.theme.colors.backgroundSecondary}20;
                 }
              `
            : ""}

      th {
         font-size: 18px;
         text-align: left;
         padding: ${(props) => props.theme.styles.space}px;
      }

      td {
         border-top: 1px solid ${(props) => props.theme.colors.border}60;
         padding: ${(props) => props.theme.styles.gap}px ${(props) => props.theme.styles.space}px;

         &.noData {
            text-align: center;
            padding: ${(props) => props.theme.styles.space}px;
         }
      }
   }
`;

const ThStyledComponent = styled.th.withConfig({
   shouldForwardProp: (prop) => !["width", "textAlign"].includes(prop),
})<{
   width?: React.CSSProperties["width"];
   textAlign?: React.CSSProperties["textAlign"];
}>`
   ${(props) => (props.width ? `width: ${props.width}px;` : "")}
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
   keyName: keyof DataItem;
   format?: (value: any) => string;
};

type ElementColumn<DataItem> = {
   type: "element";
   render: (item: DataItem, index: number) => ReactNode;
};

type ImageColumn<DataItem> = {
   type: "image";
   keyName?: keyof DataItem;
} & ImageProps;

type CheckboxColumn<DataItem> = {
   type: "checkbox";
   keyName?: keyof DataItem;
} & ToggleInputProps<boolean>;

export type TableColumn<DataItem> = {
   label?: string;
   width?: string | number;
   align?: "left" | "center" | "right";
} & (TextColumn<DataItem> | ElementColumn<DataItem> | ImageColumn<DataItem> | CheckboxColumn<DataItem>);

export type TableProps<DataItem> = {
   columns: TableColumn<DataItem>[];
   data: DataItem[];
   /** @default false */
   isStriped?: boolean;
   /** @default false */
   withStickyHeader?: boolean;
   /** @default "No data available" */
   noDataItemsMessage?: string;
   onClickRow?: (item: DataItem, index: number) => void;
   onClickAllCheckboxes?: () => void;
} & ComponentMarginProps;

type TableComponentType = {
   <DataItem>(props: ComponentPropWithRef<HTMLDivElement, TableProps<DataItem>>): React.ReactElement;
};

const TableComponent: TableComponentType = forwardRef(function Table<DataItem>(
   {
      columns,
      data,
      isStriped,
      withStickyHeader,
      noDataItemsMessage = "No data available",
      onClickRow,
      onClickAllCheckboxes,
      ...props
   }: TableProps<DataItem>,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();

   const renderCellContent = useCallback(
      (column: (typeof columns)[number], item: DataItem, index: number) => {
         switch (column.type) {
            case "text": {
               const value = item[column.keyName];

               return column.format ? column.format(value) : String(value ?? "");
            }

            case "element": {
               return column.render(item, index);
            }

            case "image": {
               const { type, keyName, ...props } = column;

               const src = keyName ? (item[keyName] as string) : undefined;

               return (
                  <Image src={src} width={defaultImageWidth} borderRadius={theme.styles.borderRadius / 2} {...props} />
               );
            }

            case "checkbox": {
               const { type, keyName, ...props } = column;

               const checked = keyName ? (item[keyName] as boolean) : false;

               return <ToggleInput.checkbox checked={checked} {...props} />;
            }

            default: {
               return <></>;
            }
         }
      },
      [theme],
   );
   const onClickRowElement = useCallback(
      (item: DataItem, index: number) => {
         onClickRow?.(item, index);
      },
      [onClickRow],
   );

   const everythingIsChecked = useMemo<boolean>(() => {
      if (!columns.some((column) => column.type === "checkbox")) return false;

      const keyName = columns.find((column) => column.type === "checkbox")?.keyName;
      if (!keyName) return false;

      return data.every((item) => item[keyName]);
   }, [data]);

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
            theme={theme}
         >
            <thead>
               <tr className="isHeader">
                  {columns.map((column, index) => (
                     <ThStyledComponent
                        width={
                           column.type === "image" ? defaultImageWidth : column.type === "checkbox" ? 26 : column.width
                        }
                        textAlign={column.align}
                        key={column.type + column.label + index}
                     >
                        {column.label ??
                           (column.type === "checkbox" && onClickAllCheckboxes ? (
                              <ToggleInput.checkbox checked={everythingIsChecked} onChange={onClickAllCheckboxes} />
                           ) : (
                              ""
                           ))}
                     </ThStyledComponent>
                  ))}
               </tr>
            </thead>

            <tbody>
               {data.length > 0 ? (
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
