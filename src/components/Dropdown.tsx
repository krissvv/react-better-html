import { forwardRef, Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { countries } from "../constants/countries";

import { ComponentPropWithRef } from "../types/components";
import { AnyOtherString, OmitProps } from "../types/app";
import { IconName } from "../types/icon";
import { Country } from "../types/countries";

import { useBooleanState } from "../utils/hooks";
import { useDebounceState } from "../utils/hooks";
import { getPluralWord } from "../utils/functions";

import Text from "./Text";
import Div, { DivProps } from "./Div";
import InputField from "./InputField";
import Icon from "./Icon";
import Button from "./Button";
import Loader from "./Loader";
import Image from "./Image";
import Chip from "./Chip";
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
   /** @default false */
   withoutRenderingOptionsWhenClosed?: boolean;
   onChangeSearch?: (query: string) => void;
   renderOption?: (option: DropdownOption<Value, Data>, index: number, isSelected: boolean) => React.ReactNode;
   renderOptionDivider?: (
      previousOption: DropdownOption<Value, Data> | undefined,
      nextOption: DropdownOption<Value, Data> | undefined,
      previousOptionIndex: number,
      nextOptionIndex: number,
   ) => React.ReactNode;
} & OmitProps<DivProps, "onChange" | "defaultChecked"> &
   (
      | {
           withMultiselect?: false;
           value?: Value;
           defaultValue?: Value;
           onChange?: (value: Value | undefined) => void;
        }
      | {
           withMultiselect?: true;
           value?: Value[];
           defaultValue?: Value[];
           onChange?: (value: Value[] | undefined) => void;
        }
   );

type DropdownComponentType = {
   <Value, Data>(props: ComponentPropWithRef<HTMLDivElement, DropdownProps<Value, Data>>): React.ReactElement;
   countries: (
      props: ComponentPropWithRef<HTMLDivElement, OmitProps<DropdownProps<string, Country>, "options">>,
   ) => React.ReactElement;
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
      withoutRenderingOptionsWhenClosed,
      onChange,
      onChangeSearch,
      renderOption,
      renderOptionDivider,
      withMultiselect,
      id,
      ...props
   }: DropdownProps<Value, Data>,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();

   const inputFieldHolderRef = useRef<HTMLDivElement>(null);
   const buttonsRef = useRef<HTMLDivElement>(null);
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

   const [internalValue, setInternalValue] = useState<Value | Value[] | undefined>(defaultValue);

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
                     const clickedValue = option.value;
                     const newValue = withMultiselect
                        ? Array.isArray(internalValue)
                           ? internalValue?.includes(clickedValue)
                              ? internalValue.filter((value) => value !== clickedValue)
                              : [...internalValue, clickedValue]
                           : [clickedValue]
                        : clickedValue;

                     if (controlledValue === undefined) setInternalValue(newValue);

                     onChange?.(newValue as any);

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
      [
         disabled,
         withSearch,
         isOpen,
         filteredOptions,
         focusedOptionIndex,
         internalValue,
         controlledValue,
         onChange,
         withMultiselect,
      ],
   );
   const onClickOption = useCallback(
      (option: DropdownOption<Value, Data>) => {
         if (!option.disabled) {
            const clickedValue = option.value;
            const newValue = withMultiselect
               ? Array.isArray(internalValue)
                  ? internalValue?.includes(clickedValue)
                     ? internalValue.filter((value) => value !== clickedValue)
                     : [...internalValue, clickedValue]
                  : [clickedValue]
               : clickedValue;

            if (controlledValue === undefined) setInternalValue(newValue);

            onChange?.(newValue as any);

            setIsOpen.setFalse();
            inputRef.current?.blur();
            setSearchQuery("");
            setFocusedOptionIndex(undefined);
         }
      },
      [onChange, internalValue, controlledValue, withMultiselect],
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

   const selectedOption = useMemo(
      () =>
         withMultiselect
            ? options.filter((option) => (Array.isArray(value) ? value.includes(option.value) : false))
            : options.find((option) => option.value === value),
      [options, value],
   );
   const renderedOptions = useMemo(
      (): React.ReactNode => (
         <>
            {renderOptionDivider ? renderOptionDivider(undefined, filteredOptions[0], -1, 0) : undefined}

            {filteredOptions.map((option, index) => {
               const isSelected = withMultiselect
                  ? Array.isArray(value)
                     ? value.includes(option.value)
                     : false
                  : option.value === value;
               const isDisabled = option.disabled;
               const isFocused = index === focusedOptionIndex;

               return (
                  <Fragment key={JSON.stringify(option)}>
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
                        filterHover={focusedOptionIndex === undefined && !isDisabled ? "brightness(0.9)" : undefined}
                        cursor={isDisabled ? "not-allowed" : "pointer"}
                        padding={`${theme.styles.gap}px ${theme.styles.space}px`}
                        value={option}
                        onClickWithValue={onClickOption}
                        onMouseMove={() => setFocusedOptionIndex(undefined)}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={isDisabled}
                     >
                        {renderOption ? renderOption(option, index, isSelected) : <Text>{option.label}</Text>}
                     </Div>

                     {renderOptionDivider
                        ? renderOptionDivider(
                             option,
                             filteredOptions[index + 1],
                             index,
                             filteredOptions[index + 1] ? index + 1 : -1,
                          )
                        : undefined}
                  </Fragment>
               );
            })}
         </>
      ),
      [
         withMultiselect,
         filteredOptions,
         value,
         focusedOptionIndex,
         theme.colors,
         onClickOption,
         renderOption,
         renderOptionDivider,
      ],
   );

   useEffect(() => {
      setInternalValue(controlledValue);
   }, [controlledValue]);
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
         if (
            inputFieldHolderRef.current &&
            buttonsRef.current &&
            !inputFieldHolderRef.current.contains(event.target as Node) &&
            !buttonsRef.current.contains(event.target as Node)
         ) {
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

   const displayValue =
      (withSearch && isFocused && searchQuery.length > 0
         ? searchQuery
         : !Array.isArray(selectedOption)
         ? selectedOption?.label
         : undefined) ?? "";
   const withClearButton = isOpen && (Array.isArray(selectedOption) ? selectedOption.length > 0 : selectedOption);
   const readyPlaceholder =
      placeholder ??
      `Select ${!withMultiselect ? "an " : ""}${
         label?.toLowerCase() ?? getPluralWord("option", withMultiselect ? 2 : 1)
      }`;

   return (
      <Div.column width="100%" position="relative" userSelect="none" {...props}>
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
            placeholder={
               withSearch
                  ? selectedOption && !Array.isArray(selectedOption)
                     ? selectedOption.label
                     : readyPlaceholder
                  : readyPlaceholder
            }
            leftIcon={leftIcon}
            autoComplete="off"
            className={`react-better-html-dropdown${
               Array.isArray(selectedOption) && selectedOption.length > 0
                  ? " react-better-html-dropdown-multiselect"
                  : ""
            }${isOpen ? " react-better-html-dropdown-open" : ""}${
               isOpenLate ? " react-better-html-dropdown-open-late" : ""
            }${inputFieldClassName ? ` ${inputFieldClassName}` : ""}`}
            onClick={!disabled ? setIsOpen.toggle : undefined}
            onFocus={setIsFocused.setTrue}
            onBlur={setIsFocused.setFalse}
            onKeyDown={onKeyDownInputField}
            onChangeValue={withSearch ? onChangeValue : undefined}
            insideInputFieldBeforeComponent={
               Array.isArray(selectedOption) && selectedOption.length > 0 ? (
                  <Div
                     width="100%"
                     backgroundColor={theme.colors.backgroundContent}
                     border={`solid 1px ${theme.colors.border}`}
                     borderColor={isFocused ? theme.colors.primary : undefined}
                     borderBottom="none"
                     borderTopLeftRadius={theme.styles.borderRadius}
                     borderTopRightRadius={theme.styles.borderRadius}
                     paddingBlock={theme.styles.gap}
                     paddingInline={(theme.styles.space + theme.styles.gap) / 2}
                     transition={theme.styles.transition}
                  >
                     <Div.row width="100%" flexWrap="wrap" gap={theme.styles.gap}>
                        {selectedOption.map((option) => (
                           <Chip text={option.label} key={JSON.stringify(option)} />
                        ))}
                     </Div.row>
                  </Div>
               ) : undefined
            }
            insideInputFieldAfterComponent={
               <>
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
                        <>
                           {(withoutRenderingOptionsWhenClosed ? isOpen || isOpenLate : true)
                              ? renderedOptions
                              : undefined}
                        </>
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

                  <Div.row
                     position="absolute"
                     top={46 / 2}
                     right={theme.styles.space + 1}
                     alignItems="center"
                     gap={theme.styles.gap}
                     transform="translateY(-50%)"
                     pointerEvents="none"
                     filter={disabled ? "brightness(0.9)" : undefined}
                     opacity={disabled ? 0.6 : undefined}
                     zIndex={isOpen || isOpenLate ? 1001 : undefined}
                     ref={buttonsRef}
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
               </>
            }
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="dropdown-list"
            aria-multiselectable={withMultiselect ? "true" : "false"}
            aria-haspopup="listbox"
            aria-label={label}
            holderRef={inputFieldHolderRef}
            ref={inputRef}
         />
      </Div.column>
   );
}) as any;

DropdownComponent.countries = forwardRef(function Countries({ ...props }, ref) {
   const theme = useTheme();

   const renderOption = useCallback(
      (option: DropdownOption<string, Country>, index: number, isSelected: boolean): React.ReactNode => (
         <Div.row alignItems="center" gap={theme.styles.gap}>
            <Image src={`https://flagcdn.com/w80/${option.data?.code.toString().toLowerCase()}.webp`} width={20} />
            <Text>{option.label}</Text>
         </Div.row>
      ),
      [],
   );

   const options = useMemo<DropdownOption<string, Country>[]>(
      () =>
         countries.map(
            (country): DropdownOption<string, Country> => ({
               value: country.code,
               label: country.name,
               data: country,
               searchValues: [country.code],
            }),
         ),
      [],
   );

   return (
      <DropdownComponent
         placeholder="Select a country"
         options={options}
         renderOption={renderOption}
         withoutRenderingOptionsWhenClosed
         ref={ref}
         {...(props as any)}
      />
   );
}) as DropdownComponentType["countries"];

const Dropdown = memo(DropdownComponent) as any as typeof DropdownComponent & {
   countries: typeof DropdownComponent.countries;
};

Dropdown.countries = DropdownComponent.countries;

export default Dropdown;
