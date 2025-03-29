import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ComponentPropWithRef } from "../types/components";
import { OmitProps } from "../types/app";

import { useBooleanState } from "../utils/hooks";

import Text from "./Text";
import Div, { DivProps } from "./Div";
import InputField from "./InputField";
import Icon from "./Icon";
import Button from "./Button";
import { useTheme } from "./BetterHtmlProvider";

export type DropdownOption<Value> = {
   label: string;
   value: Value;
   disabled?: boolean;
   searchValues?: string[];
};

type DropdownProps<Value> = {
   label?: string;
   errorText?: string;
   infoText?: string;
   required?: boolean;
   disabled?: boolean;
   options: DropdownOption<Value>[];
   value?: Value;
   placeholder?: string;
   withSearch?: boolean;
   onChange?: (value: Value | undefined) => void;
} & OmitProps<DivProps<unknown>, "onChange">;

type DropdownComponentType = {
   <Value>(props: ComponentPropWithRef<HTMLDivElement, DropdownProps<Value>>): React.ReactElement;
};

const DropdownComponent: DropdownComponentType = forwardRef(function Dropdown<Value>(
   {
      label,
      errorText,
      infoText,
      required,
      disabled,
      options,
      value: controlledValue,
      onChange,
      placeholder = "Select an option",
      withSearch,
      ...props
   }: DropdownProps<Value>,
   ref: React.ForwardedRef<HTMLDivElement>,
) {
   const theme = useTheme();

   const dropdownHolderRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const [isOpen, setIsOpen] = useBooleanState();
   const [isOpenLate, setIsOpenLate] = useBooleanState();
   const [isFocused, setIsFocused] = useBooleanState();

   const [searchQuery, setSearchQuery] = useState("");
   const [focusedOptionIndex, setFocusedOptionIndex] = useState<number | undefined>();

   const [internalValue, setInternalValue] = useState<Value | undefined>();

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
      (option: DropdownOption<Value>) => {
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

         if (controlledValue === undefined) setInternalValue(undefined);

         onChange?.(undefined);

         setIsOpen.setFalse();
         inputRef.current?.blur();
         setSearchQuery("");
         setFocusedOptionIndex(undefined);
      },
      [controlledValue, onChange],
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
         if (dropdownHolderRef.current && !dropdownHolderRef.current.contains(event.target as Node)) {
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

   const displayValue = withSearch && isFocused ? searchQuery : selectedOption?.label ?? "";
   const withClearButton = isOpen && selectedOption;

   return (
      <Div.column position="relative" userSelect="none" {...props} ref={dropdownHolderRef}>
         <Div.row position="relative" width="100%" zIndex={isOpen || isOpenLate ? 1001 : undefined}>
            <InputField
               label={label}
               errorText={errorText}
               infoText={infoText}
               required={required}
               disabled={disabled}
               readOnly={!withSearch}
               value={displayValue}
               placeholder={withSearch ? (selectedOption ? selectedOption.label : placeholder) : placeholder}
               className={isOpen ? "react-better-html-dropdown-open" : ""}
               onClick={!disabled ? setIsOpen.toggle : undefined}
               onFocus={setIsFocused.setTrue}
               onBlur={setIsFocused.setFalse}
               onKeyDown={onKeyDownInputField}
               onChangeText={withSearch ? setSearchQuery : undefined}
               role="combobox"
               aria-expanded={isOpen}
               aria-controls="dropdown-list"
               aria-haspopup="listbox"
               aria-label={label}
               ref={inputRef}
            />

            <Div.row
               position="absolute"
               top={46 / 2 + (label ? 16 + theme.styles.gap / 2 : 0)}
               right={theme.styles.space}
               alignItems="center"
               gap={theme.styles.gap}
               transform="translateY(-50%)"
               pointerEvents="none"
               filter={disabled ? "brightness(0.9)" : undefined}
               opacity={disabled ? 0.6 : undefined}
            >
               <Button.icon
                  icon="XMark"
                  size={10}
                  iconSize={14}
                  opacity={!withClearButton ? 0 : undefined}
                  pointerEvents={withClearButton ? "all" : undefined}
                  onClick={onClickClearButton}
                  disabled={!withClearButton}
               />

               <Icon
                  name="chevronDown"
                  size={16}
                  color={theme.colors.textSecondary}
                  transform={`rotate(${isOpen ? 180 : 0}deg)`}
                  transition={theme.styles.transition}
               />
            </Div.row>
         </Div.row>

         <Div
            position="absolute"
            top={46 + (label ? 16 + theme.styles.gap / 2 : 0)}
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
            {filteredOptions.map((option, index) => {
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
                     filterHover={focusedOptionIndex === undefined && !isDisabled ? "brightness(0.9)" : undefined}
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
                     <Text>{option.label}</Text>
                  </Div>
               );
            })}
         </Div>
      </Div.column>
   );
}) as any;

const Dropdown = memo(DropdownComponent) as any as typeof DropdownComponent & {};

export default Dropdown;
