import { countries } from "../constants/countries";

import { PartialRecord } from "../types/app";

import { useForm } from "./hooks";

export const generateRandomString = (stringLength: number): string => {
   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

   let result = "";
   for (let index = 0; index < stringLength; index++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
   }

   return result;
};

export const getBrowser = () => {
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
