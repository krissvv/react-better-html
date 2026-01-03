import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "react-better-core";

import { useMediaQuery } from "../utils/hooks";

import Div from "./Div";
import Button from "./Button";
import Text from "./Text";

type PaginationProps = {
   currentPage?: number;
   itemsLength?: number;
   itemsPerPage?: number;
   pageCount?: number;
   /** @default 11 */
   maximumVisiblePages?: number;
   onClickPreviousPage?: (newPage: number) => void;
   onClickNextPage?: (newPage: number) => void;
   onChangePage?: (page: number) => void;
};

type PaginationComponentType = {
   (props: PaginationProps): React.ReactElement;
};

const PaginationComponent: PaginationComponentType = function Pagination({
   currentPage = 1,
   itemsLength = 0,
   itemsPerPage,
   pageCount,
   maximumVisiblePages = 11,
   onClickPreviousPage,
   onClickNextPage,
   onChangePage,
}: PaginationProps) {
   const theme = useTheme();
   const mediaQuery = useMediaQuery();

   const [currentPageInternal, setCurrentPage] = useState<number>(currentPage);

   const pageCountInternal = pageCount ?? (itemsPerPage !== undefined ? Math.ceil(itemsLength / itemsPerPage) : 1);

   const onClickPreviousPageElement = useCallback(() => {
      const newPage = currentPageInternal <= 1 ? 1 : currentPageInternal - 1;

      setCurrentPage(newPage);
      onClickPreviousPage?.(newPage);
   }, [currentPageInternal, onClickPreviousPage]);
   const onClickNextPageElement = useCallback(() => {
      const newPage = currentPageInternal >= pageCountInternal ? pageCountInternal : currentPageInternal + 1;

      setCurrentPage(newPage);
      onClickNextPage?.(newPage);
   }, [currentPageInternal, pageCountInternal, onClickNextPage]);

   const paginationItems = useMemo(() => {
      const halfRange = Math.floor(maximumVisiblePages / 2);

      let startPage = Math.max(1, currentPageInternal - halfRange);
      let endPage = Math.min(pageCountInternal, currentPageInternal + halfRange);

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
   }, [pageCountInternal, currentPageInternal]);

   useEffect(() => {
      onChangePage?.(currentPageInternal);
   }, [currentPageInternal, onChangePage]);
   useEffect(() => {
      setCurrentPage(currentPage);
   }, [currentPage]);

   const mobileFooterBreakingPoint = mediaQuery.size700 && pageCountInternal > maximumVisiblePages / 1.4;

   return (
      <Div.row alignItems="center" justifyContent="center" gap={theme.styles.gap * 2}>
         {pageCountInternal > maximumVisiblePages && (
            <Button.icon
               icon="doubleChevronLeft"
               disabled={currentPageInternal === 1}
               value={1}
               onClickWithValue={setCurrentPage}
            />
         )}
         <Button.icon icon="chevronLeft" disabled={currentPageInternal === 1} onClick={onClickPreviousPageElement} />

         <Div.row
            alignItems="center"
            justifyContent="center"
            flexWrap={mobileFooterBreakingPoint ? "wrap" : undefined}
            gap={theme.styles.gap}
         >
            {paginationItems.map((pageIndex) => {
               const isActive = currentPageInternal === pageIndex;

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
            disabled={currentPageInternal === pageCountInternal}
            onClick={onClickNextPageElement}
         />
         {pageCountInternal > maximumVisiblePages && (
            <Button.icon
               icon="doubleChevronRight"
               disabled={currentPageInternal === pageCountInternal}
               onClickWithValue={setCurrentPage}
               value={pageCountInternal}
            />
         )}
      </Div.row>
   );
};

const Pagination = memo(PaginationComponent) as any as typeof PaginationComponent & {};

export default Pagination;
