import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ComponentPropWithRef } from "../types/components";
import { AnyOtherString, OmitProps } from "../types/app";
import { IconName } from "../types/icon";

import { useBooleanState } from "../utils/hooks";
import { useDebounceState } from "../utils/hooks";

import Text from "./Text";
import Div, { DivProps } from "./Div";
import InputField from "./InputField";
import Icon from "./Icon";
import Button from "./Button";
import Loader from "./Loader";
import { useTheme } from "./BetterHtmlProvider";

export type DropdownOption<Value, Data = unknown> = {
   value: Value;
   label: string;
   /** @default false */
   disabled?: boolean;
   searchValues?: string[];
   data?: Data;
};

export type DropdownProps<Value, Data = unknown> = {
   label?: string;
   labelColor?: string;
   errorText?: string;
   infoText?: string;
   /** @default false */
   required?: boolean;
   name?: string;
   /** @default false */
   disabled?: boolean;
   options: DropdownOption<Value, Data>[];
   value?: Value;
   defaultValue?: Value;
   placeholder?: string;
   leftIcon?: IconName | AnyOtherString;
   inputFieldClassName?: string;
   /** @default false */
   withSearch?: boolean;
   /** @default false */
   withDebounce?: boolean;
   /** @default 0.5s */
   debounceDelay?: number;
   /** @default false */
   debounceIsLoading?: boolean;
   debounceMinimumSymbolsRequired?: number;
   /** @default false */
   withoutClearButton?: boolean;
   onChange?: (value: Value | undefined) => void;
   onChangeSearch?: (query: string) => void;
   renderOption?: (option: DropdownOption<Value, Data>, index: number, isSelected: boolean) => React.ReactNode;
} & OmitProps<DivProps, "onChange" | "defaultChecked">;

type DropdownComponentType = {
   <Value, Data>(props: ComponentPropWithRef<HTMLDivElement, DropdownProps<Value, Data>>): React.ReactElement;
};

const DropdownComponent: DropdownComponentType = forwardRef(function Dropdown<Value, Data>(
   {
      label,
      labelColor,
      errorText,
      infoText,
      required,
      name,
      disabled,
      options,
      value: controlledValue,
      defaultValue,
      placeholder,
      leftIcon,
      inputFieldClassName,
      withSearch,
      withDebounce,
      debounceDelay = 0.5,
      debounceIsLoading,
      debounceMinimumSymbolsRequired,
      withoutClearButton,
      onChange,
      onChangeSearch,
      renderOption,
      id,
      ...props
   }: DropdownProps<Value, Data>,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();

   const inputFieldHolderRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const [isOpen, setIsOpen] = useBooleanState();
   const [isOpenLate, setIsOpenLate] = useBooleanState();
   const [isFocused, setIsFocused] = useBooleanState();

   const [searchQuery, setSearchQuery] = useState("");
   const [_, debouncedSearchQuery, setDebouncedSearchQuery, isLoadingDebouncedSearchQuery] = useDebounceState<string>(
      "",
      debounceDelay,
   );
   const [focusedOptionIndex, setFocusedOptionIndex] = useState<number | undefined>();

   const [internalValue, setInternalValue] = useState<Value | undefined>(defaultValue);

   const value = controlledValue ?? internalValue;

   const filteredOptions = useMemo(() => {
      if (!searchQuery) return options;

      const query = searchQuery.toLowerCase();

      return options.filter(
         (option) =>
            option.label.toLowerCase().includes(query) ||
            option.searchValues?.some((value) => value.toLowerCase().includes(query)),
      );
   }, [options, searchQuery]);

   const onKeyDownInputField = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
         if (event.key === "Enter" || (!withSearch && event.key === " ")) {
            event.preventDefault();

            if (!disabled) {
               setIsOpen.toggle();

               if (isOpen && filteredOptions.length > 0 && focusedOptionIndex !== undefined) {
                  const option = filteredOptions[focusedOptionIndex];

                  if (!option.disabled) {
                     if (controlledValue === undefined) setInternalValue(option.value);

                     onChange?.(option.value);

                     setIsOpen.setFalse();
                     inputRef.current?.blur();
                     setSearchQuery("");
                     setFocusedOptionIndex(undefined);
                  }
               }
            }
         } else if (event.key === "Escape") {
            setIsOpen.setFalse();
            setFocusedOptionIndex(undefined);
         } else if (event.key === "ArrowDown") {
            event.preventDefault();

            if (!isOpen) setIsOpen.setTrue();

            if (filteredOptions.length > 0) {
               setFocusedOptionIndex((oldValue) =>
                  oldValue === undefined ? 0 : (oldValue + 1) % filteredOptions.length,
               );
            }
         } else if (event.key === "ArrowUp") {
            event.preventDefault();

            if (!isOpen) setIsOpen.setTrue();

            if (filteredOptions.length > 0) {
               setFocusedOptionIndex((oldValue) =>
                  oldValue === undefined
                     ? filteredOptions.length - 1
                     : (oldValue - 1 + filteredOptions.length) % filteredOptions.length,
               );
            }
         }
      },
      [disabled, withSearch, isOpen, filteredOptions, focusedOptionIndex, controlledValue, onChange],
   );
   const onClickOption = useCallback(
      (option: DropdownOption<Value, Data>) => {
         if (!option.disabled) {
            if (controlledValue === undefined) setInternalValue(option.value);

            onChange?.(option.value);

            setIsOpen.setFalse();
            inputRef.current?.blur();
            setSearchQuery("");
            setFocusedOptionIndex(undefined);
         }
      },
      [onChange, controlledValue],
   );
   const onClickClearButton = useCallback(
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
         event.stopPropagation();

         setInternalValue(undefined);
         onChange?.(undefined);

         setIsOpen.setFalse();
         inputRef.current?.blur();
         setSearchQuery("");
         setFocusedOptionIndex(undefined);
      },
      [onChange],
   );
   const onChangeValue = useCallback(
      (newValue: string) => {
         setSearchQuery(newValue);

         if (withDebounce) setDebouncedSearchQuery(newValue);
         else onChangeSearch?.(newValue);
      },
      [withDebounce, onChangeSearch],
   );

   const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);

   useEffect(() => {
      if (isOpen) {
         setIsOpenLate.setTrue();

         if (withSearch && inputRef.current) inputRef.current.focus();
      } else {
         const timeout = setTimeout(setIsOpenLate.setFalse, 0.2 * 1000);

         return () => {
            clearTimeout(timeout);
         };
      }
   }, [isOpen, withSearch]);
   useEffect(() => {
      setFocusedOptionIndex(undefined);
   }, [filteredOptions]);
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (inputFieldHolderRef.current && !inputFieldHolderRef.current.contains(event.target as Node)) {
            setIsOpen.setFalse();
            setSearchQuery("");
            setFocusedOptionIndex(undefined);
         }
      };

      if (isOpen) {
         document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [isOpen]);
   useEffect(() => {
      if (!withDebounce) return;

      onChangeSearch?.(debouncedSearchQuery);
   }, [withDebounce, onChangeSearch, debouncedSearchQuery]);

   const displayValue = withSearch && isFocused ? searchQuery : selectedOption?.label ?? "";
   const withClearButton = isOpen && selectedOption;
   const readyPlaceholder = placeholder ? placeholder : `Select an ${label?.toLowerCase() ?? "option"}`;

   return (
      <Div.column width="100%" position="relative" userSelect="none" {...props}>
         <Div.row position="relative" width="100%" ref={inputFieldHolderRef}>
            <InputField
               label={label}
               labelColor={labelColor}
               errorText={errorText}
               infoText={infoText}
               required={required}
               name={name}
               disabled={disabled}
               readOnly={!withSearch}
               value={displayValue}
               id={id}
               cursor={!withSearch ? "pointer" : undefined}
               placeholder={withSearch ? (selectedOption ? selectedOption.label : readyPlaceholder) : readyPlaceholder}
               leftIcon={leftIcon}
               className={`react-better-html-dropdown${isOpen ? " react-better-html-dropdown-open" : ""}${
                  isOpenLate ? " react-better-html-dropdown-open-late" : ""
               }${inputFieldClassName ? ` ${inputFieldClassName}` : ""}`}
               onClick={!disabled ? setIsOpen.toggle : undefined}
               onFocus={setIsFocused.setTrue}
               onBlur={setIsFocused.setFalse}
               onKeyDown={onKeyDownInputField}
               onChangeValue={withSearch ? onChangeValue : undefined}
               insideInputFieldComponent={
                  <Div
                     position="absolute"
                     top="100%"
                     left={0}
                     width="100%"
                     maxHeight={300}
                     backgroundColor={theme.colors.backgroundContent}
                     border={`1px solid ${isFocused ? theme.colors.primary : theme.colors.border}`}
                     borderTop="none"
                     borderBottomLeftRadius={theme.styles.borderRadius}
                     borderBottomRightRadius={theme.styles.borderRadius}
                     boxShadow="0px 10px 20px #00000020"
                     zIndex={1000}
                     overflowY="auto"
                     opacity={!isOpen ? 0 : undefined}
                     pointerEvents={!isOpen ? "none" : undefined}
                     transform={`translateY(${!isOpen ? -10 : 0}px)`}
                     transition={theme.styles.transition}
                     role="listbox"
                     aria-label={label}
                  >
                     {isLoadingDebouncedSearchQuery || debounceIsLoading ? (
                        <Div padding={`${theme.styles.space / 2}px ${theme.styles.space + theme.styles.gap}px`}>
                           <Loader.text />
                        </Div>
                     ) : filteredOptions.length ? (
                        filteredOptions.map((option, index) => {
                           const isSelected = option.value === value;
                           const isDisabled = option.disabled;
                           const isFocused = index === focusedOptionIndex;

                           return (
                              <Div
                                 color={
                                    isDisabled
                                       ? theme.colors.textSecondary + "80"
                                       : isSelected
                                       ? theme.colors.base
                                       : theme.colors.textPrimary
                                 }
                                 backgroundColor={isSelected ? theme.colors.primary : theme.colors.backgroundContent}
                                 filter={isFocused ? (isDisabled ? "brightness(0.95)" : "brightness(0.9)") : undefined}
                                 filterHover={
                                    focusedOptionIndex === undefined && !isDisabled ? "brightness(0.9)" : undefined
                                 }
                                 cursor={isDisabled ? "not-allowed" : "pointer"}
                                 padding={`${theme.styles.space / 2}px ${theme.styles.space + theme.styles.gap}px`}
                                 value={option}
                                 onClickWithValue={onClickOption}
                                 onMouseMove={() => setFocusedOptionIndex(undefined)}
                                 role="option"
                                 aria-selected={isSelected}
                                 aria-disabled={isDisabled}
                                 key={JSON.stringify(option)}
                              >
                                 {renderOption ? renderOption(option, index, isSelected) : <Text>{option.label}</Text>}
                              </Div>
                           );
                        })
                     ) : (
                        <Div padding={`${theme.styles.space / 2}px ${theme.styles.space + theme.styles.gap}px`}>
                           <Text.unknown textAlign="left">
                              {debounceMinimumSymbolsRequired !== undefined &&
                              searchQuery.length < debounceMinimumSymbolsRequired
                                 ? `Enter at least ${debounceMinimumSymbolsRequired} characters`
                                 : "No options"}
                           </Text.unknown>
                        </Div>
                     )}
                  </Div>
               }
               role="combobox"
               aria-expanded={isOpen}
               aria-controls="dropdown-list"
               aria-haspopup="listbox"
               aria-label={label}
               ref={inputRef}
            />

            <Div.row
               position="absolute"
               top={46 / 2 + (label ? 16 + theme.styles.gap : 0)}
               right={theme.styles.space + 1}
               alignItems="center"
               gap={theme.styles.gap}
               transform="translateY(-50%)"
               pointerEvents="none"
               filter={disabled ? "brightness(0.9)" : undefined}
               opacity={disabled ? 0.6 : undefined}
               zIndex={isOpen || isOpenLate ? 1001 : undefined}
            >
               {!withoutClearButton && (
                  <Button.icon
                     icon="XMark"
                     position="relative"
                     size={10}
                     iconSize={14}
                     opacity={!withClearButton ? 0 : undefined}
                     pointerEvents={withClearButton ? "all" : undefined}
                     onClick={onClickClearButton}
                     disabled={!withClearButton}
                  />
               )}

               <Icon
                  name="chevronDown"
                  position="relative"
                  size={16}
                  color={theme.colors.textSecondary}
                  transform={`rotate(${isOpen ? 180 : 0}deg)`}
                  transition={theme.styles.transition}
                  pointerEvents="none"
                  aria-hidden
               />
            </Div.row>
         </Div.row>
      </Div.column>
   );
}) as any;

const Dropdown = memo(DropdownComponent) as any as typeof DropdownComponent & {};

export default Dropdown;
