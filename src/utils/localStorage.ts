import { LocalStoragePluginOptions } from "../plugins";

import { decryptString, encryptString } from "./functions";
import { checkBetterHtmlContextValue } from "./variableFunctions";

import { externalBetterHtmlContextValue } from "../components/BetterHtmlProvider";

/**
 * @description All values inside LocalStorage needs to be optional
 */
export function generateLocalStorage<LocalStorage extends object>(): {
   setItem: <StorageName extends keyof LocalStorage>(name: StorageName, value: LocalStorage[StorageName]) => void;
   getItem: <StorageName extends keyof LocalStorage>(name: StorageName) => LocalStorage[StorageName] | undefined;
   removeItem: (name: keyof LocalStorage) => void;
   removeAllItems: () => void;
} {
   return {
      setItem: (name, value) => {
         if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "generateLocalStorage"))
            return undefined as any;

         const localStoragePlugin = externalBetterHtmlContextValue.plugins.find(
            (plugin) => plugin.name === "localStorage",
         );

         if (!localStoragePlugin) {
            throw new Error(
               "`generateLocalStorage` hook requires the `localStorage` plugin to be added to the `plugins` prop in `<BetterHtmlProvider>`.",
            );
         }

         const pluginConfig: LocalStoragePluginOptions = localStoragePlugin.getConfig?.() ?? {};

         const encryptionEnabled = pluginConfig.encryption?.enabled ?? false;

         const readyName = encryptionEnabled ? encryptString(name.toString()) : name;
         const readyValue = encryptionEnabled ? encryptString(JSON.stringify(value)) : JSON.stringify(value);

         if (value) localStorage.setItem(readyName.toString(), readyValue);
         else localStorage.removeItem(readyName.toString());
      },
      getItem: (name) => {
         if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "generateLocalStorage"))
            return undefined as any;

         const localStoragePlugin = externalBetterHtmlContextValue.plugins.find(
            (plugin) => plugin.name === "localStorage",
         );

         if (!localStoragePlugin) {
            throw new Error(
               "`generateLocalStorage` hook requires the `localStorage` plugin to be added to the `plugins` prop in `<BetterHtmlProvider>`.",
            );
         }

         const pluginConfig: LocalStoragePluginOptions = localStoragePlugin.getConfig?.() ?? {};

         const encryptionEnabled = pluginConfig.encryption?.enabled ?? false;

         const readyName = encryptionEnabled ? encryptString(name.toString()) : name;
         const item = localStorage.getItem(readyName.toString());

         if (item === null) return undefined;

         try {
            return encryptionEnabled ? JSON.parse(decryptString(item)) : JSON.parse(item);
         } catch (error) {
            return undefined;
         }
      },
      removeItem: (name) => {
         if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "generateLocalStorage"))
            return undefined as any;

         const localStoragePlugin = externalBetterHtmlContextValue.plugins.find(
            (plugin) => plugin.name === "localStorage",
         );

         if (!localStoragePlugin) {
            throw new Error(
               "`generateLocalStorage` hook requires the `localStorage` plugin to be added to the `plugins` prop in `<BetterHtmlProvider>`.",
            );
         }

         const pluginConfig: LocalStoragePluginOptions = localStoragePlugin.getConfig?.() ?? {};

         const encryptionEnabled = pluginConfig.encryption?.enabled ?? false;

         const readyName = encryptionEnabled ? encryptString(name.toString()) : name;

         localStorage.removeItem(readyName.toString());
      },
      removeAllItems: () => {
         localStorage.clear();
      },
   };
}
