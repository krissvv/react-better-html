import { countries } from "../constants/countries";

import { PartialRecord } from "../types/app";
import { BrowserName } from "../types/other";

import { useForm } from "./hooks";

export const generateRandomString = (
   stringLength: number,
   options?: {
      /** @default true */
      includeCapitalLetters?: boolean;
      /** @default true */
      includeLowerLetters?: boolean;
      /** @default true */
      includeNumbers?: boolean;
      /** @default 1 */
      dashSections?: number;
   },
): string => {
   const capitals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   const lowers = "abcdefghijklmnopqrstuvwxyz";
   const numbers = "0123456789";

   const includes: string[] = [];

   if (options?.includeCapitalLetters !== false) includes.push(capitals);
   if (options?.includeLowerLetters !== false) includes.push(lowers);
   if (options?.includeNumbers !== false) includes.push(numbers);

   const characters = includes.join("");

   const dashSections = Math.max(1, options?.dashSections ?? 1);
   const dashSectionLength = Math.floor(stringLength / dashSections);

   if (stringLength < dashSections) return "";

   let result = "";
   let currentSectionLength = 0;

   while (result.length < stringLength) {
      if (currentSectionLength >= dashSectionLength) {
         result += "-";
         currentSectionLength = 0;
      }

      if (result.length < stringLength) {
         result += characters.charAt(Math.floor(Math.random() * characters.length));
         currentSectionLength += 1;
      }
   }

   return result;
};

export const getBrowser = (): BrowserName | undefined => {
   const userAgent = navigator.userAgent.toLowerCase();

   if (userAgent.includes("firefox")) return "firefox";
   if (userAgent.includes("chrome") && !userAgent.includes("edg")) return "chrome";
   if (userAgent.includes("safari") && !userAgent.includes("chrome")) return "safari";
   if (userAgent.includes("edg")) return "edge";
   if (userAgent.includes("opr") || userAgent.includes("opera")) return "opera";

   return;
};

export const formatPhoneNumber = (phoneNumber: string): string => {
   const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");

   const country = countries.find(
      (country) => country.phoneNumberExtension === cleanPhoneNumber.slice(0, country.phoneNumberExtension.length),
   );

   if (!country) return phoneNumber;

   let phonNumberRest = cleanPhoneNumber.slice(country.phoneNumberExtension.length);

   if (country.phoneNumberFormat) {
      let formattedNumber = "";
      let index = 0;

      for (const char of country.phoneNumberFormat) {
         if (char === "X" && index < phonNumberRest.length) {
            formattedNumber += phonNumberRest[index];
            index++;
         } else {
            formattedNumber += char;
         }
      }

      phonNumberRest = formattedNumber.replace(/X/g, "").trim();
   }

   return `+${country.phoneNumberExtension} ${phonNumberRest}`;
};

export const getFormErrorObject = <FormFields extends ReturnType<typeof useForm>["values"]>(
   formValues: FormFields,
): PartialRecord<keyof FormFields, string> => {
   return {};
};
