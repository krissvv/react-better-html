import { PartialRecord } from "react-better-core";
import CryptoJS from "crypto-js";

import { BrowserName } from "../types/other";

import { LocalStoragePluginOptions } from "../plugins";
import { checkBetterHtmlContextValue } from "./variableFunctions";
import { useForm } from "./hooks";

import { externalBetterHtmlContextValue } from "../components/BetterHtmlProvider";

export const getBrowser = (): BrowserName | undefined => {
   const userAgent = navigator.userAgent.toLowerCase();

   if (userAgent.includes("firefox")) return "firefox";
   if (userAgent.includes("chrome") && !userAgent.includes("edg")) return "chrome";
   if (userAgent.includes("safari") && !userAgent.includes("chrome")) return "safari";
   if (userAgent.includes("edg")) return "edge";
   if (userAgent.includes("opr") || userAgent.includes("opera")) return "opera";

   return;
};

export const getFormErrorObject = <FormFields extends ReturnType<typeof useForm>["values"]>(
   formValues: FormFields,
): PartialRecord<keyof FormFields, string> => {
   return {};
};

export const encryptString = (text: string): string => {
   if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "encryptString")) return undefined as any;

   const localStoragePlugin = externalBetterHtmlContextValue.plugins.find((plugin) => plugin.name === "localStorage");

   if (!localStoragePlugin) {
      throw new Error(
         "`encryptString` hook requires the `localStorage` plugin to be added to the `plugins` prop in `<BetterHtmlProvider>`.",
      );
   }

   const pluginConfig: LocalStoragePluginOptions = localStoragePlugin.getConfig();

   if (!pluginConfig.encryption?.enabled) return text;

   const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Hex.parse(pluginConfig.encryption.secretKey), {
      iv: CryptoJS.enc.Hex.parse(pluginConfig.encryption.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
   }).toString();

   return encrypted;
};

export const decryptString = <ReturnValue extends string>(text: string): ReturnValue => {
   if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "decryptString")) return undefined as any;

   const localStoragePlugin = externalBetterHtmlContextValue.plugins.find((plugin) => plugin.name === "localStorage");

   if (!localStoragePlugin) {
      throw new Error(
         "`decryptString` hook requires the `localStorage` plugin to be added to the `plugins` prop in `<BetterHtmlProvider>`.",
      );
   }

   const pluginConfig: LocalStoragePluginOptions = localStoragePlugin.getConfig();

   if (!pluginConfig.encryption?.enabled) return text as ReturnValue;

   const decrypted = CryptoJS.AES.decrypt(text, CryptoJS.enc.Hex.parse(pluginConfig.encryption.secretKey), {
      iv: CryptoJS.enc.Hex.parse(pluginConfig.encryption.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
   });

   return decrypted.toString(CryptoJS.enc.Utf8) as ReturnValue;
};

export function findClosestNumber(numbers: number[], target: number): number {
   let closest = numbers[0];
   let minDistance = Math.abs(target - numbers[0]);

   for (let index = 1; index < numbers.length; index++) {
      const distance = Math.abs(target - numbers[index]);

      if (distance < minDistance || (distance === minDistance && numbers[index] < closest)) {
         closest = numbers[index];
         minDistance = distance;
      }
   }

   return closest;
}
