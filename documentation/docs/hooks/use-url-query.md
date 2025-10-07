---
title: useUrlQuery
description: A hook for managing URL query parameters in React applications
sidebar_position: 9
---

# useUrlQuery Hook

The `useUrlQuery` hook provides a simple and effective way to manage URL query parameters in your React applications. It allows you to read, set, and remove query parameters while maintaining browser history.

:::warning
To use the `useUrlQuery` hook, you need to have the `react-router-dom` plugin added to the `plugins` prop in your `<BetterHtmlProvider>`.
:::

## Basic Usage

```jsx
import { Div, useUrlQuery } from "react-better-html";

function SearchPage() {
   // highlight-next-line
   const urlQuery = useUrlQuery();

   const handleSearch = (term) => {
      // highlight-next-line
      urlQuery.setQuery({
         searchValue: term
      });
   };

   const clearSearch = () => {
      // highlight-next-line
      urlQuery.removeQuery("searchValue");
   };

   return (
      <Div.box>
         // highlight-next-line
         <Text>Search results for: {urlQuery.getQuery("searchValue")}</Text>
      </Div.box>
   );
}
```

## Hook Return Values

-  **`getQuery`** - gets the value of a specific query parameter by name. Returns `null` if the parameter doesn't exist.
-  **`setQuery`** - sets one or more query parameters. The `keepHistory` parameter determines whether to keep the current URL in the browser history.
-  **`removeQuery`** - removes a specific query parameter by name. The `keepHistory` parameter determines whether to keep the current URL in the browser history.

## Usage Notes

-  Changes to query parameters will update the URL in the browser's address bar.
-  When `keepHistory` is set to `true` (default), browser back/forward navigation will work as expected.
-  When `keepHistory` is set to `false`, the current URL will be replaced in the browser history and going back will not work.
-  Query parameters are always stored as strings in the URL. If you need to store numbers or other data types, you'll need to handle the conversion yourself.

## Examples

### Managing Filters

```jsx
import { useUrlQuery, Button, Div } from "react-better-html";

function ProductList() {
   // highlight-next-line
   const urlQuery = useUrlQuery();

   // highlight-start
   const category = urlQuery.getQuery("category") || "all";
   const sortBy = urlQuery.getQuery("sortBy") || "newest";
   // highlight-end

   const onClickChangeCategory = (newCategory) => {
      // highlight-start
      urlQuery.setQuery({
         category: newCategory
      });
      // highlight-end
   };

   const onClickChangeSortBy = (newSortBy) => {
      // highlight-start
      urlQuery.setQuery({
         sortBy: newSortBy
      });
      // highlight-end
   };

   const resetFilters = () => {
      // highlight-start
      urlQuery.setQuery({
         category: "all",
         sortBy: "newest"
      });
      // highlight-end
   };

   return (
      <Div>
         <Div.row gap={10}>
            <Button
               text="All"
               backgroundColor={category === "all" ? "#007bff" : undefined}
               value="all"
               onClick={onClickChangeCategory}
            />
            <Button
               text="Electronics"
               backgroundColor={category === "electronics" ? "#007bff" : undefined}
               value="electronics"
               onClick={onClickChangeCategory}
            />
            <Button
               text="Clothing"
               backgroundColor={category === "clothing" ? "#007bff" : undefined}
               value="clothing"
               onClick={onClickChangeCategory}
            />
         </Div.row>

         <Div.row gap={10} marginTop={10}>
            <Button
               text="Newest"
               backgroundColor={sortBy === "newest" ? "#007bff" : undefined}
               value="newest"
               onClick={onClickChangeSortBy}
            />
            <Button
               text="Price: Low to High"
               backgroundColor={sortBy === "price_asc" ? "#007bff" : undefined}
               value="price_asc"
               onClick={onClickChangeSortBy}
            />
            <Button
               text="Price: High to Low"
               backgroundColor={sortBy === "price_desc" ? "#007bff" : undefined}
               value="price_desc"
               onClick={onClickChangeSortBy}
            />
         </Div.row>

         <Button text="Reset Filters" onClick={resetFilters} marginTop={10} />

         <Div marginTop={20}>
            Showing {category} products, sorted by {sortBy}
         </Div>
      </Div>
   );
}
```

### Pagination with URL Query

```jsx
import { useUrlQuery, Button, Div, Text } from "react-better-html";

const itemsPerPage = 10;
const totalItems = 100;
const totalPages = Math.ceil(totalItems / itemsPerPage);

function PaginatedList() {
   // highlight-next-line
   const urlQuery = useUrlQuery();

   // highlight-next-line
   const currentPage = parseInt(urlQuery.getQuery("page") || "1", 10);

   const onClickChangePage = (page) => {
      // highlight-start
      urlQuery.setQuery({
         page
      });
      // highlight-end
   };

   return (
      <Div>
         <Text>
            Page {currentPage} of {totalPages}
         </Text>

         <Div.row gap={10} marginTop={20} justifyContent="center">
            <Button text="Previous" disabled={currentPage <= 1} value={currentPage - 1} onClick={onClickChangePage} />

            {Array.from({ length: totalPages }, (_, index) => index + 1)
               .filter((page) => Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages)
               .map((page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                     return <Text key={`ellipsis-${page}`}>...</Text>;
                  }

                  return (
                     <Button
                        key={page}
                        text={page.toString()}
                        backgroundColor={currentPage === page ? "#007bff" : undefined}
                        value={page}
                        onClick={onClickChangePage}
                     />
                  );
               })}

            <Button
               text="Next"
               disabled={currentPage >= totalPages}
               value={currentPage + 1}
               onClick={onClickChangePage}
            />
         </Div.row>
      </Div>
   );
}
```
