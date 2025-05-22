import { useCallback, useMemo, useState, memo, useEffect } from "react";

import Div from "./Div";
import Text from "./Text";
import Button from "./Button";
import { useTheme } from "./BetterHtmlProvider";

const getMonthName = (month: number, short = false) => {
   return [
      short ? "Jan" : "January",
      short ? "Feb" : "February",
      short ? "Mar" : "March",
      short ? "Apr" : "April",
      short ? "May" : "May",
      short ? "Jun" : "June",
      short ? "Jul" : "July",
      short ? "Aug" : "August",
      short ? "Sep" : "September",
      short ? "Oct" : "October",
      short ? "Nov" : "November",
      short ? "Dec" : "December",
   ][month];
};
const getWeekDayName = (day: number, short = false) => {
   return [
      short ? "Sun" : "Sunday",
      short ? "Mon" : "Monday",
      short ? "Tue" : "Tuesday",
      short ? "Wed" : "Wednesday",
      short ? "Thu" : "Thursday",
      short ? "Fri" : "Friday",
      short ? "Sat" : "Saturday",
   ][day];
};

const weekDaysIndex = [1, 2, 3, 4, 5, 6, 0];

type CalendarProps = {
   value?: string;
   minDate?: Date;
   maxDate?: Date;
   onChange?: (date?: string) => void;
};

function Calendar({ value, minDate, maxDate, onChange }: CalendarProps) {
   const theme = useTheme();

   const [currentDate, setCurrentDate] = useState(value ? new Date(value) : undefined);
   const [currentMonth, setCurrentMonth] = useState(currentDate?.getMonth() ?? new Date().getMonth());
   const [currentYear, setCurrentYear] = useState(currentDate?.getFullYear() ?? new Date().getFullYear());

   const daysInMonth = useMemo(() => new Date(currentYear, currentMonth + 1, 0).getDate(), [currentMonth, currentYear]);

   const onClickPreviousMonthButton = useCallback(() => {
      const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
   }, [currentMonth, currentYear]);
   const onClickNextMonthButton = useCallback(() => {
      const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;

      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
   }, [currentMonth, currentYear]);
   const onClickDay = useCallback(
      (day: number | undefined) => {
         if (!day) return;

         const newDate = new Date(currentYear, currentMonth, day);

         setCurrentDate(newDate);
         onChange?.(
            `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, "0")}-${newDate
               .getDate()
               .toString()
               .padStart(2, "0")}`,
         );
      },
      [currentMonth, currentYear, onChange],
   );
   const onClickClear = useCallback(() => {
      setCurrentDate(undefined);
      onChange?.(undefined);
   }, []);
   const onClickToday = useCallback(() => {
      const today = new Date();

      setCurrentDate(today);
      onChange?.(
         `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today
            .getDate()
            .toString()
            .padStart(2, "0")}`,
      );
   }, [onChange]);

   const firstDayOfMonth = useMemo(() => {
      const day = new Date(currentYear, currentMonth, 1).getDay();

      return day === 0 ? 6 : day - 1;
   }, [currentMonth, currentYear]);
   const days = useMemo(() => {
      const result = [];

      for (let index = 0; index < firstDayOfMonth; index++) {
         result.push(undefined);
      }
      for (let index = 1; index <= daysInMonth; index++) {
         result.push(index);
      }

      return result;
   }, [daysInMonth, firstDayOfMonth]);

   useEffect(() => {
      if (!value) return;

      const date = new Date(value);

      setCurrentDate(date);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
   }, [value]);

   return (
      <Div.column width="100%" maxWidth={320} gap={theme.styles.gap} padding={theme.styles.space / 2} userSelect="none">
         <Div.row width="100%" justifyContent="space-between" alignItems="center">
            <Button.icon icon="chevronLeft" onClick={onClickPreviousMonthButton} />

            <Text fontWeight={700}>
               {getMonthName(currentMonth)} {currentYear}
            </Text>

            <Button.icon icon="chevronRight" onClick={onClickNextMonthButton} />
         </Div.row>

         <Div.grid width="100%" gridTemplateColumns="repeat(7, 1fr)" gap={theme.styles.gap / 2}>
            {weekDaysIndex.map((day) => (
               <Div.row alignItems="center" justifyContent="center" key={day}>
                  <Text fontSize={14} fontWeight={700} textAlign="center">
                     {getWeekDayName(day, true)}
                  </Text>
               </Div.row>
            ))}

            {days.map((day, index) => {
               const thisDayDate = new Date(currentYear, currentMonth, day);

               const isSelected =
                  day !== undefined &&
                  day === currentDate?.getDate() &&
                  currentMonth === currentDate.getMonth() &&
                  currentYear === currentDate.getFullYear();

               const isWeekend = thisDayDate.getDay() === 6 || thisDayDate.getDay() === 0;

               const isDisabled =
                  (minDate && thisDayDate.getTime() < minDate.getTime()) ||
                  (maxDate && thisDayDate.getTime() > maxDate.getTime());

               return (
                  <Div.row
                     position="relative"
                     width="100%"
                     aspectRatio="1"
                     alignItems="center"
                     justifyContent="center"
                     backgroundColor={isSelected ? theme.colors.primary : theme.colors.backgroundContent}
                     filterHover={!isDisabled ? "brightness(0.9)" : undefined}
                     borderRadius={theme.styles.borderRadius / 2}
                     padding={theme.styles.space / 2}
                     cursor={day ? (!isDisabled ? "pointer" : "not-allowed") : undefined}
                     value={day}
                     onClickWithValue={!isDisabled ? onClickDay : undefined}
                     key={index}
                  >
                     {day && (
                        <Text
                           fontSize={14}
                           textAlign="center"
                           color={
                              isDisabled
                                 ? theme.colors.textSecondary + "80"
                                 : isSelected
                                 ? theme.colors.base
                                 : isWeekend
                                 ? theme.colors.textSecondary
                                 : undefined
                           }
                        >
                           {day}
                        </Text>
                     )}

                     {isDisabled && (
                        <Div
                           position="absolute"
                           width="60%"
                           height={1}
                           top="50%"
                           left="50%"
                           backgroundColor={theme.colors.textSecondary}
                           borderRadius={999}
                           transform="translate(-50%, -50%) rotate(45deg)"
                        />
                     )}
                  </Div.row>
               );
            })}
         </Div.grid>

         <Div.row width="100%" justifyContent="space-between" alignItems="center">
            <Div isTabAccessed cursor="pointer" onClick={onClickClear}>
               <Text
                  fontSize={14}
                  textDecorationHover="underline"
                  color={theme.colors.textSecondary}
                  colorHover={theme.colors.textPrimary}
               >
                  Clear
               </Text>
            </Div>

            <Div isTabAccessed cursor="pointer" onClick={onClickToday}>
               <Text
                  fontSize={14}
                  textDecorationHover="underline"
                  color={theme.colors.textSecondary}
                  colorHover={theme.colors.textPrimary}
               >
                  Today
               </Text>
            </Div>
         </Div.row>
      </Div.column>
   );
}

export default memo(Calendar);
