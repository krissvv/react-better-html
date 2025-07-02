import {
   forwardRef,
   memo,
   useCallback,
   ReactNode,
   useMemo,
   useState,
   useImperativeHandle,
   useRef,
   useEffect,
   Fragment,
} from "react";
import styled, { css } from "styled-components";

import { ColorTheme, Theme } from "../types/theme";
import { ComponentMarginProps, ComponentPropWithRef } from "../types/components";

import { useForm, useMediaQuery } from "../utils/hooks";

import Div from "./Div";
import ToggleInput, { ToggleInputProps } from "./ToggleInput";
import Image, { ImageProps } from "./Image";
import Text, { TextProps } from "./Text";
import Loader from "./Loader";
import Button from "./Button";
import Modal, { ModalRef } from "./Modal";
import FormRow from "./FormRow";
import InputField from "./InputField";
import Form from "./Form";
import Label from "./Label";
import Icon from "./Icon";
import { useBetterHtmlContextInternal, useTheme } from "./BetterHtmlProvider";

const defaultImageWidth = 160;
const maximumVisiblePages = 11;

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

      &.isFooter {
         background-color: ${(props) => props.theme.colors.backgroundSecondary};
      }

      &.isClickable {
         cursor: pointer;
      }

      &.isExpandRow {
         height: 0px;

         td {
            border-top: none;
         }
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

                 &:not(.isHeader):not(.isFooter):not(.withoutHover):hover {
                    filter: brightness(${props.colorTheme === "light" ? 0.95 : 0.7});
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

const filterPresetsText: Record<FilterPreset, string> = {
   today: "Today",
   yesterday: "Yesterday",
   tomorrow: "Tomorrow",
   thisWeek: "This week",
   thisMonth: "This month",
   thisYear: "This year",
   lastWeek: "Last week",
   lastMonth: "Last month",
   lastYear: "Last year",
   nextWeek: "Next week",
   nextMonth: "Next month",
   nextYear: "Next year",
};

type FilterPreset =
   | "today"
   | "yesterday"
   | "tomorrow"
   | "thisWeek"
   | "thisMonth"
   | "thisYear"
   | "lastWeek"
   | "lastMonth"
   | "lastYear"
   | "nextWeek"
   | "nextMonth"
   | "nextYear";

type TableFilterData =
   | {
        type: "number";
        min?: number;
        max?: number;
     }
   | {
        type: "date" | "date-time";
        min?: string;
        max?: string;
     }
   | {
        type: "list";
        list?: string[];
     };

//? Column types
type TextColumn<DataItem> = {
   type: "text";
   keyName?: keyof DataItem;
   getTextProps?: ((item: DataItem, index: number) => TextProps) | TextProps;
   format?: (item: DataItem, index: number) => string;
};

type ElementColumn<DataItem> = {
   type: "element";
   render?: (item: DataItem, index: number) => ReactNode;
};

type ImageColumn<DataItem> = {
   type: "image";
   getImageProps?: ((item: DataItem, index: number) => ImageProps) | ImageProps;
};

type CheckboxColumn<DataItem> = {
   type: "checkbox";
   getToggleInputProps?: ((item: DataItem, index: number) => ToggleInputProps<DataItem>) | ToggleInputProps<DataItem>;
};

type ExpandColumn<DataItem> = {
   type: "expand";
   onlyOneExpanded?: boolean;
   render?: (item: DataItem, index: number) => ReactNode;
};

//? Filter types
type NumberFilter<DataItem> = {
   filter?: "number";
   getValue?: (item: DataItem) => number;
};

type DateFilter<DataItem> = {
   filter?: "date" | "date-time";
   presets?: FilterPreset[];
   getValue?: (item: DataItem) => Date;
};

type ListFilter<DataItem> = {
   filter?: "list";
   withTotalNumber?: boolean;
   getValueForList?: (item: DataItem) => string;
};

export type TableColumn<DataItem> = {
   label?: string;
   width?: string | number;
   minWidth?: string | number;
   maxWidth?: string | number;
   align?: "left" | "center" | "right";
} & (
   | TextColumn<DataItem>
   | ElementColumn<DataItem>
   | ImageColumn<DataItem>
   | CheckboxColumn<DataItem>
   | ExpandColumn<DataItem>
) &
   (NumberFilter<DataItem> | DateFilter<DataItem> | ListFilter<DataItem>);

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
   pageSize?: number;
   pageCount?: number;
   onClickRow?: (item: DataItem, index: number) => void;
   onClickAllCheckboxes?: (checked: boolean) => void;
   onChangePage?: (page: number) => void;
   onChangeFilter?: (filterData: Record<number, TableFilterData | undefined>) => void;
} & ComponentMarginProps;

export type TableRef = {
   currentPage: number;
   setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
   pagesCount: number;
   setCheckedItems: React.Dispatch<React.SetStateAction<boolean[]>>;
};

type TableComponentType = {
   <DataItem>(props: ComponentPropWithRef<TableRef, TableProps<DataItem>>): React.ReactElement;
};

const TableComponent: TableComponentType = forwardRef(function Table<DataItem>(
   {
      columns,
      data,
      isStriped,
      isLoading,
      withStickyHeader,
      noDataItemsMessage = "No data available",
      pageSize,
      pageCount,
      onClickRow,
      onClickAllCheckboxes,
      onChangePage,
      onChangeFilter,
      ...props
   }: TableProps<DataItem>,
   ref: React.ForwardedRef<TableRef>,
) {
   const theme = useTheme();
   const mediumScreen = useMediaQuery();
   const { colorTheme } = useBetterHtmlContextInternal();

   const filterModalRef = useRef<ModalRef>(null);

   const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
   const [expandedRows, setExpandedRows] = useState<boolean[]>([]);
   const [currentPage, setCurrentPage] = useState<number>(1);

   const [filterData, setFilterData] = useState<Record<number, TableFilterData | undefined>>({});
   const [openedFilterColumnIndex, setOpenedFilterColumnIndex] = useState<number>();

   const [filterListSelectedItems, setFilterListSelectedItems] = useState<string[]>();

   const openedFilterData = openedFilterColumnIndex ? filterData[openedFilterColumnIndex] : undefined;
   const openedFilterColumn = openedFilterColumnIndex ? columns[openedFilterColumnIndex] : undefined;

   const filterForm = useForm({
      defaultValues: {
         min: undefined as number | string | undefined,
         max: undefined as number | string | undefined,
      },
      onSubmit: (values) => {
         if (!openedFilterColumn?.filter) return;
         if (openedFilterColumnIndex === undefined) return;

         setFilterData((oldValue) => ({
            ...oldValue,
            [openedFilterColumnIndex]:
               openedFilterColumn.filter === "number"
                  ? {
                       type: openedFilterColumn.filter,
                       min: values.min as number | undefined,
                       max: values.max as number | undefined,
                    }
                  : openedFilterColumn.filter === "date" || openedFilterColumn.filter === "date-time"
                  ? {
                       type: openedFilterColumn.filter,
                       min: values.min as string | undefined,
                       max: values.max as string | undefined,
                    }
                  : openedFilterColumn.filter === "list"
                  ? {
                       type: openedFilterColumn.filter,
                       list: filterListSelectedItems,
                    }
                  : undefined,
         }));

         filterModalRef.current?.close();
      },
   });

   const expandRow = useMemo(() => columns.find((column) => column.type === "expand"), [columns]);

   const renderCellContent = useCallback(
      (column: (typeof columns)[number], item: DataItem, itemIndex: number) => {
         switch (column.type) {
            case "text": {
               const value = column.keyName ? item[column.keyName] : undefined;
               const textProps =
                  (typeof column.getTextProps === "function"
                     ? column.getTextProps?.(item, itemIndex)
                     : column.getTextProps) ?? {};

               return <Text {...textProps}>{column.format?.(item, itemIndex) ?? String(value ?? "")}</Text>;
            }

            case "element": {
               return column.render?.(item, itemIndex) ?? <></>;
            }

            case "image": {
               const imageProps =
                  (typeof column.getImageProps === "function"
                     ? column.getImageProps?.(item, itemIndex)
                     : column.getImageProps) ?? {};

               return <Image width="100%" borderRadius={theme.styles.borderRadius / 2} {...imageProps} />;
            }

            case "checkbox": {
               const { onChange, ...toggleInputProps } =
                  (typeof column.getToggleInputProps === "function"
                     ? column.getToggleInputProps?.(item, itemIndex)
                     : column.getToggleInputProps) ?? {};

               const checkedValue = checkedItems[itemIndex];

               return (
                  <ToggleInput.checkbox
                     checked={checkedValue}
                     value={item}
                     onChange={(checked, value) => {
                        setCheckedItems((oldValue) =>
                           oldValue.map((isChecked, internalIndex) =>
                              internalIndex === itemIndex ? checked : isChecked,
                           ),
                        );

                        onChange?.(checked, value);
                     }}
                     {...toggleInputProps}
                  />
               );
            }

            case "expand": {
               return (
                  <Icon
                     name="chevronDown"
                     transform={`rotate(${expandedRows[itemIndex] ? 180 : 0}deg)`}
                     transition={theme.styles.transition}
                  />
               );
            }

            default: {
               return <></>;
            }
         }
      },
      [theme, checkedItems, expandedRows],
   );
   const onClickRowElement = useCallback(
      (item: DataItem, index: number) => {
         if (expandRow) {
            setExpandedRows((oldValue) => {
               if (oldValue[index] === undefined) {
                  const newValue = expandRow.onlyOneExpanded ? [] : [...oldValue];
                  newValue[index] = true;

                  return newValue;
               }
               return oldValue.map((isExpanded, internalIndex) => (internalIndex === index ? !isExpanded : isExpanded));
            });
         } else onClickRow?.(item, index);
      },
      [onClickRow, expandRow],
   );
   const onClickAllCheckboxesElement = useCallback(
      (checked: boolean) => {
         onClickAllCheckboxes?.(checked);
         setCheckedItems(data.map(() => checked));
      },
      [onClickAllCheckboxes, data],
   );
   const onClickFilterButton = useCallback(
      (columnIndex: number) => {
         const thisFilterData = filterData[columnIndex];

         if (
            thisFilterData?.type === "number" ||
            thisFilterData?.type === "date" ||
            thisFilterData?.type === "date-time"
         ) {
            filterForm.setFieldsValue({
               min: thisFilterData.min ?? undefined,
               max: thisFilterData.max ?? undefined,
            });
         } else if (thisFilterData?.type === "list") {
            setFilterListSelectedItems(thisFilterData.list);
         }

         setOpenedFilterColumnIndex(columnIndex);
         filterModalRef.current?.open();
      },
      [filterData],
   );
   const onCloseFilterModal = useCallback(() => {
      setTimeout(() => setOpenedFilterColumnIndex(undefined), 0.2 * 1000);
      setFilterListSelectedItems(undefined);
      filterForm.reset();
   }, []);
   const onClickCancelFormFilter = useCallback(() => {
      if (openedFilterColumnIndex === undefined) return;

      setFilterData((oldValue) => ({
         ...oldValue,
         [openedFilterColumnIndex]: undefined,
      }));

      filterModalRef.current?.close();
   }, [openedFilterColumnIndex]);
   const onClickFilterListItem = useCallback(
      (value: string) =>
         setFilterListSelectedItems((oldValue) => {
            if (!oldValue) return [value];
            if (oldValue.includes(value)) return oldValue.filter((item) => item !== value);
            return [...oldValue, value];
         }),
      [],
   );
   const onClickFilterPreset = useCallback(
      (preset: FilterPreset) => {
         const getValueForDate = (date: Date) => {
            if (openedFilterColumn?.filter === "date") return date.toISOString().split("T")[0];
            return date.toISOString();
         };

         switch (preset) {
            case "today":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date()),
                  max: getValueForDate(new Date()),
               });
               break;

            case "yesterday":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date(new Date().setDate(new Date().getDate() - 1))),
                  max: getValueForDate(new Date(new Date().setDate(new Date().getDate() - 1))),
               });
               break;

            case "tomorrow":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date(new Date().setDate(new Date().getDate() + 1))),
                  max: getValueForDate(new Date(new Date().setDate(new Date().getDate() + 1))),
               });
               break;

            case "thisWeek":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date(new Date().setDate(new Date().getDate() - 7))),
                  max: getValueForDate(new Date()),
               });
               break;

            case "thisMonth":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date(new Date().setMonth(new Date().getMonth() - 1))),
                  max: getValueForDate(new Date()),
               });
               break;

            case "thisYear":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1))),
                  max: getValueForDate(new Date()),
               });
               break;

            case "lastWeek":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date(new Date().setDate(new Date().getDate() - 7))),
                  max: getValueForDate(new Date(new Date().setDate(new Date().getDate() - 1))),
               });
               break;

            case "lastMonth":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date(new Date().setMonth(new Date().getMonth() - 1))),
                  max: getValueForDate(new Date(new Date().setDate(new Date().getDate() - 1))),
               });
               break;

            case "lastYear":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1))),
                  max: getValueForDate(new Date(new Date().setDate(new Date().getDate() - 1))),
               });
               break;

            case "nextWeek":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date(new Date().setDate(new Date().getDate() + 7))),
                  max: getValueForDate(new Date(new Date().setDate(new Date().getDate() + 7))),
               });
               break;

            case "nextMonth":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date(new Date().setMonth(new Date().getMonth() + 1))),
                  max: getValueForDate(new Date(new Date().setMonth(new Date().getMonth() + 1))),
               });
               break;

            case "nextYear":
               filterForm.setFieldsValue({
                  min: getValueForDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
                  max: getValueForDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
               });
               break;

            default:
               break;
         }
      },
      [openedFilterColumn],
   );
   const renderExpandedRow = useCallback(
      (...props: Parameters<NonNullable<ExpandColumn<DataItem>["render"]>>) => {
         const expandColumn = columns.find((column) => column.type === "expand");
         if (!expandColumn) return;

         return expandColumn.render?.(...props);
      },
      [columns],
   );

   const dataAfterFilter = useMemo(
      () =>
         data.filter((item) =>
            Object.entries(filterData).every(([columnIndex, filter]) => {
               if (!filter) return true;

               const column = columns[parseInt(columnIndex)];
               if (!column) return true;

               if (column.filter === "number" && filter.type === "number") {
                  const itemValue: number =
                     column.getValue?.(item) ??
                     (column.type === "text" && column.keyName ? Number(item[column.keyName]) : 0);

                  if (filter.min !== undefined && itemValue < filter.min) return false;
                  if (filter.max !== undefined && itemValue > filter.max) return false;
               } else if (
                  (column.filter === "date" && filter.type === "date") ||
                  (column.filter === "date-time" && filter.type === "date-time")
               ) {
                  const minDate = filter.min ? new Date(filter.min) : undefined;
                  const maxDate = filter.max ? new Date(filter.max) : undefined;

                  const itemValue: Date =
                     column.getValue?.(item) ??
                     new Date(column.type === "text" && column.keyName ? String(item[column.keyName]) : "");

                  if (filter.min !== undefined && minDate && itemValue < minDate) return false;
                  if (filter.max !== undefined && maxDate && itemValue > maxDate) return false;
               } else if (column.filter === "list" && filter.type === "list") {
                  const itemValue: string =
                     column.getValueForList?.(item) ??
                     (column.type === "text" && column.keyName ? String(item[column.keyName]) : "");

                  if (!filter.list?.includes(itemValue)) return false;
               }

               return true;
            }),
         ),
      [data, filterData, columns],
   );
   const dataAfterPagination = useMemo(() => {
      if (pageSize === undefined) return dataAfterFilter;
      if (pageCount !== undefined) return dataAfterFilter;

      const pageStartItemIndex = (currentPage - 1) * (pageSize ?? 0);
      const pageEndItemIndex = pageStartItemIndex + (pageSize ?? 0);

      return dataAfterFilter.slice(pageStartItemIndex, pageEndItemIndex);
   }, [dataAfterFilter, pageSize, currentPage, pageCount]);
   const everythingIsChecked = useMemo<boolean>(() => {
      return checkedItems.every((checked) => checked) && checkedItems.length === data.length;
   }, [data, checkedItems]);
   const possibleFilterListValues = useMemo<{ value: string; count: number }[]>(() => {
      if (!openedFilterColumn) return [];

      return data.reduce(
         (previousValue, currentValue) => {
            const value: string | undefined =
               openedFilterColumn.type === "text" && openedFilterColumn.keyName
                  ? String(currentValue[openedFilterColumn.keyName])
                  : undefined;

            if (value !== undefined) {
               if (previousValue.some((item) => item.value === value)) {
                  previousValue = previousValue.map((item) =>
                     item.value === value
                        ? {
                             ...item,
                             count: item.count + 1,
                          }
                        : item,
                  );
               } else
                  previousValue.push({
                     value,
                     count: 1,
                  });
            }

            return previousValue;
         },
         [] as {
            value: string;
            count: number;
         }[],
      );
   }, [data, openedFilterColumn]);

   const pageCountInternal = pageCount ?? (pageSize !== undefined ? Math.ceil(dataAfterFilter.length / pageSize) : 1);

   const paginationItems = useMemo(() => {
      const halfRange = Math.floor(maximumVisiblePages / 2);

      let startPage = Math.max(1, currentPage - halfRange);
      let endPage = Math.min(pageCountInternal, currentPage + halfRange);

      if (endPage - startPage + 1 < maximumVisiblePages) {
         startPage = Math.max(1, endPage - maximumVisiblePages + 1);
         endPage = Math.min(pageCountInternal, startPage + maximumVisiblePages - 1);
      }

      return Array.from(
         {
            length: endPage - startPage + 1,
         },
         (_, index) => startPage + index,
      );
   }, [pageCountInternal, currentPage]);
   const onClickNextPage = useCallback(() => {
      setCurrentPage((oldValue) => (oldValue >= pageCountInternal ? pageCountInternal : oldValue + 1));
   }, [pageCountInternal]);
   const onClickPreviousPage = useCallback(() => {
      setCurrentPage((oldValue) => (oldValue <= 1 ? 1 : oldValue - 1));
   }, []);
   const onClickSelectAllFilterListItems = useCallback(
      () => setFilterListSelectedItems(possibleFilterListValues.map((item) => item.value)),
      [possibleFilterListValues],
   );
   const onClickDeselectAllFilterListItems = useCallback(() => setFilterListSelectedItems([]), []);

   useEffect(() => {
      onChangePage?.(currentPage);
   }, [onChangePage, currentPage]);
   useEffect(() => {
      onChangeFilter?.(filterData);
   }, [onChangeFilter, filterData]);

   useImperativeHandle(
      ref,
      (): TableRef => {
         return {
            currentPage,
            setCurrentPage,
            pagesCount: pageCountInternal,
            setCheckedItems,
         };
      },
      [currentPage, setCurrentPage, pageCountInternal, setCheckedItems],
   );

   const mobileFooterBreakingPoint = mediumScreen.size700 && pageCountInternal > maximumVisiblePages / 1.4;

   return (
      <>
         <Div
            border={`1px solid ${theme.colors.border}`}
            borderRadius={theme.styles.borderRadius * 2}
            overflow="auto"
            {...props}
         >
            <TableStyledComponent
               isStriped={isStriped}
               withHover={onClickRow !== undefined || expandRow !== undefined}
               withStickyHeader={withStickyHeader}
               colorTheme={colorTheme}
               theme={theme}
            >
               <thead>
                  <tr className="isHeader">
                     {columns.map((column, index) => (
                        <ThStyledComponent
                           width={
                              column.width ??
                              (column.type === "image"
                                 ? defaultImageWidth
                                 : column.type === "checkbox"
                                 ? 26
                                 : column.type === "expand"
                                 ? 16
                                 : undefined)
                           }
                           minWidth={column.minWidth}
                           maxWidth={column.maxWidth}
                           textAlign={column.align}
                           key={column.type + column.label + index}
                        >
                           <Div.row
                              width="100%"
                              alignItems="center"
                              justifyContent={
                                 column.filter
                                    ? "space-between"
                                    : column.align === "center"
                                    ? "center"
                                    : column.align === "right"
                                    ? "flex-end"
                                    : "flex-start"
                              }
                              gap={theme.styles.gap}
                           >
                              {column.type === "checkbox" && onClickAllCheckboxes ? (
                                 <ToggleInput.checkbox
                                    checked={everythingIsChecked}
                                    onChange={onClickAllCheckboxesElement}
                                 />
                              ) : column.label ? (
                                 <Text>{column.label}</Text>
                              ) : undefined}

                              {column.filter && (
                                 <Button.icon
                                    icon="filter"
                                    color={filterData[index] ? theme.colors.primary : theme.colors.textSecondary}
                                    value={index}
                                    onClickWithValue={onClickFilterButton}
                                 />
                              )}
                           </Div.row>
                        </ThStyledComponent>
                     ))}
                  </tr>
               </thead>

               <tbody>
                  {isLoading ? (
                     <tr className="withoutHover">
                        <td className="noData" colSpan={columns.length}>
                           <Loader.box />
                        </td>
                     </tr>
                  ) : dataAfterPagination.length > 0 ? (
                     dataAfterPagination.map((item, rowIndex) => (
                        <Fragment key={JSON.stringify(item) + rowIndex}>
                           <tr
                              className={onClickRow || expandRow ? "isClickable" : undefined}
                              onClick={() => onClickRowElement(item, rowIndex)}
                           >
                              {columns.map((column, colIndex) => (
                                 <TdStyledComponent
                                    textAlign={column.align}
                                    key={column.type + column.label + colIndex}
                                 >
                                    {renderCellContent(column, item, rowIndex)}
                                 </TdStyledComponent>
                              ))}
                           </tr>

                           {expandedRows[rowIndex] && (
                              <tr className="withoutHover isExpandRow">
                                 <td colSpan={columns.length}>{renderExpandedRow(item, rowIndex)}</td>
                              </tr>
                           )}
                        </Fragment>
                     ))
                  ) : (
                     <tr className="withoutHover">
                        <td className="noData" colSpan={columns.length}>
                           <Text.unknown>{noDataItemsMessage}</Text.unknown>
                        </td>
                     </tr>
                  )}
               </tbody>

               {pageSize !== undefined && pageCountInternal > 1 && (
                  <tfoot>
                     <tr className="isFooter">
                        <td colSpan={columns.length}>
                           <Div.column
                              position="relative"
                              width="100%"
                              justifyContent="center"
                              flexReverse
                              gap={theme.styles.gap / 2}
                           >
                              <Text
                                 position={mobileFooterBreakingPoint ? "relative" : "absolute"}
                                 top={!mobileFooterBreakingPoint ? "50%" : undefined}
                                 color={theme.colors.textSecondary}
                                 transform={!mobileFooterBreakingPoint ? "translateY(-50%)" : undefined}
                                 userSelect="none"
                              >
                                 {currentPage} / {pageCountInternal}
                              </Text>

                              <Div.row alignItems="center" justifyContent="center" gap={theme.styles.gap * 2}>
                                 {pageCountInternal > maximumVisiblePages && (
                                    <Button.icon
                                       icon="doubleChevronLeft"
                                       disabled={currentPage === 1}
                                       value={1}
                                       onClickWithValue={setCurrentPage}
                                    />
                                 )}
                                 <Button.icon
                                    icon="chevronLeft"
                                    disabled={currentPage === 1}
                                    onClick={onClickPreviousPage}
                                 />

                                 <Div.row
                                    alignItems="center"
                                    justifyContent="center"
                                    flexWrap={mobileFooterBreakingPoint ? "wrap" : undefined}
                                    gap={theme.styles.gap}
                                 >
                                    {paginationItems.map((pageIndex) => {
                                       const isActive = currentPage === pageIndex;

                                       return (
                                          <Div
                                             cursor="pointer"
                                             userSelect="none"
                                             value={pageIndex}
                                             onClickWithValue={setCurrentPage}
                                             key={pageIndex}
                                          >
                                             <Text
                                                fontWeight={isActive ? 700 : 400}
                                                color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                                                transition={theme.styles.transition}
                                             >
                                                {pageIndex}
                                             </Text>
                                          </Div>
                                       );
                                    })}
                                 </Div.row>

                                 <Button.icon
                                    icon="chevronRight"
                                    disabled={currentPage === pageCountInternal}
                                    onClick={onClickNextPage}
                                 />
                                 {pageCountInternal > maximumVisiblePages && (
                                    <Button.icon
                                       icon="doubleChevronRight"
                                       disabled={currentPage === pageCountInternal}
                                       onClickWithValue={setCurrentPage}
                                       value={pageCountInternal}
                                    />
                                 )}
                              </Div.row>
                           </Div.column>
                        </td>
                     </tr>
                  </tfoot>
               )}
            </TableStyledComponent>
         </Div>

         <Modal
            title={`Filter ${openedFilterColumn?.label}`}
            description={
               openedFilterColumn?.filter === "number"
                  ? "Enter minimum and maximum values to filter"
                  : openedFilterColumn?.filter === "date" || openedFilterColumn?.filter === "date-time"
                  ? "Enter minimum and maximum dates to filter"
                  : openedFilterColumn?.filter === "list"
                  ? "Select values to filter from the list bellow"
                  : ""
            }
            onClose={onCloseFilterModal}
            ref={filterModalRef}
         >
            {openedFilterColumn ? (
               openedFilterColumn.filter === "number" ? (
                  <Form
                     form={filterForm}
                     submitButtonText="Filter"
                     cancelButtonText="Clear"
                     onClickCancel={openedFilterData ? onClickCancelFormFilter : undefined}
                  >
                     <FormRow>
                        <InputField type="number" label="Min" {...filterForm.getInputFieldProps("min")} />
                        <InputField type="number" label="Max" {...filterForm.getInputFieldProps("max")} />
                     </FormRow>
                  </Form>
               ) : openedFilterColumn.filter === "date" || openedFilterColumn.filter === "date-time" ? (
                  <Form
                     form={filterForm}
                     gap={theme.styles.gap}
                     submitButtonText="Filter"
                     cancelButtonText="Clear"
                     onClickCancel={openedFilterData ? onClickCancelFormFilter : undefined}
                  >
                     <FormRow>
                        {openedFilterColumn.filter === "date" ? (
                           <>
                              <InputField.date label="Min" {...filterForm.getInputFieldProps("min")} />
                              <InputField.date label="Max" {...filterForm.getInputFieldProps("max")} />
                           </>
                        ) : (
                           <>
                              <InputField.dateTime label="Min" {...filterForm.getInputFieldProps("min")} />
                              <InputField.dateTime label="Max" {...filterForm.getInputFieldProps("max")} />
                           </>
                        )}
                     </FormRow>

                     {openedFilterColumn.presets && (
                        <Div.column gap={theme.styles.gap / 2}>
                           <Label text="Presets" />

                           <Div.row alignItems="center" gap={theme.styles.gap}>
                              {openedFilterColumn.presets.map((preset) => {
                                 return (
                                    <Button.secondary
                                       text={filterPresetsText[preset]}
                                       value={preset}
                                       onClickWithValue={onClickFilterPreset}
                                       key={preset}
                                    />
                                 );
                              })}
                           </Div.row>
                        </Div.column>
                     )}
                  </Form>
               ) : openedFilterColumn.filter === "list" ? (
                  <Form
                     submitButtonText="Filter"
                     cancelButtonText="Clear"
                     renderActionButtons={
                        <Div.row marginRight="auto" alignItems="center" gap={theme.styles.gap}>
                           <Button.secondary
                              text="Select All"
                              disabled={possibleFilterListValues.length === filterListSelectedItems?.length}
                              onClick={onClickSelectAllFilterListItems}
                           />
                           <Button.secondary
                              text="Deselect All"
                              disabled={!filterListSelectedItems?.length}
                              onClick={onClickDeselectAllFilterListItems}
                           />
                        </Div.row>
                     }
                     onClickCancel={openedFilterData ? onClickCancelFormFilter : undefined}
                     onSubmit={filterForm.onSubmit}
                  >
                     <Div.column gap={theme.styles.gap / 2} marginBottom={theme.styles.space}>
                        <Label text="Possible values" />

                        <Div.row flexWrap="wrap" gap={theme.styles.gap}>
                           {possibleFilterListValues.map((value) => {
                              const isActive = filterListSelectedItems?.includes(value.value);

                              return (
                                 <Div.box
                                    isActive={isActive}
                                    value={value.value}
                                    onClickWithValue={onClickFilterListItem}
                                    key={value.value}
                                 >
                                    <Div.row alignItems="center" gap={theme.styles.gap / 2}>
                                       <Text>{value.value}</Text>

                                       {openedFilterColumn.withTotalNumber && (
                                          <Text
                                             fontSize={14}
                                             color={isActive ? theme.colors.base + "c0" : theme.colors.textSecondary}
                                          >
                                             ({value.count})
                                          </Text>
                                       )}
                                    </Div.row>
                                 </Div.box>
                              );
                           })}
                        </Div.row>
                     </Div.column>
                  </Form>
               ) : (
                  <Text.unknown>Unknown filter</Text.unknown>
               )
            ) : (
               <Loader.box />
            )}
         </Modal>
      </>
   );
}) as any;

const Table = memo(TableComponent) as any as typeof TableComponent;

export default Table;
