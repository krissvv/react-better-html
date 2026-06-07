import { LocalStoragePluginOptions } from "../plugins";

import { decryptString, encryptString } from "./functions";
import { checkBetterHtmlContextValue } from "./variableFunctions";

import { externalBetterHtmlContextValue } from "../components/BetterHtmlProvider";

export function generateLocalStorage<LocalStorage extends object>(): {
   setItem: <StorageName extends keyof LocalStorage>(name: StorageName, value: LocalStorage[StorageName]) => void;
   getItem: <StorageName extends keyof LocalStorage>(name: StorageName) => LocalStorage[StorageName] | undefined;
   getAllItems: () => Partial<LocalStorage>;
   removeItem: (name: keyof LocalStorage) => void;
   removeAllItems: (config?: { keepValues?: (keyof LocalStorage)[] }) => void;
} {
   const setItem = <StorageName extends keyof LocalStorage>(name: StorageName, value: LocalStorage[StorageName]) => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "generateLocalStorage.setItem"))
         return undefined as any;

      const localStoragePlugin = externalBetterHtmlContextValue.plugins.find(
         (plugin) => plugin.name === "localStorage",
      );

      if (!localStoragePlugin) {
         throw new Error(
            "`generateLocalStorage.setItem` function requires the `localStorage` plugin to be added to the `plugins` prop in `<BetterHtmlProvider>`.",
         );
      }

      const pluginConfig: LocalStoragePluginOptions = localStoragePlugin.getConfig();

      const encryptionEnabled = pluginConfig.encryption?.enabled ?? false;

      const readyName = encryptionEnabled ? encryptString(name.toString()) : name;
      const readyValue = encryptionEnabled ? encryptString(JSON.stringify(value)) : JSON.stringify(value);

      if (value) localStorage.setItem(readyName.toString(), readyValue);
      else localStorage.removeItem(readyName.toString());
   };
   const getAllItems = (): Partial<LocalStorage> => {
      if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "generateLocalStorage.getAllItems"))
         return undefined as any;

      const localStoragePlugin = externalBetterHtmlContextValue.plugins.find(
         (plugin) => plugin.name === "localStorage",
      );

      if (!localStoragePlugin) {
         throw new Error(
            "`generateLocalStorage.getAllItems` function requires the `localStorage` plugin to be added to the `plugins` prop in `<BetterHtmlProvider>`.",
         );
      }

      const pluginConfig: LocalStoragePluginOptions = localStoragePlugin.getConfig();

      const encryptionEnabled = pluginConfig.encryption?.enabled ?? false;

      const items = {
         ...localStorage,
      };

      try {
         return encryptionEnabled
            ? Object.entries(items).reduce<Partial<LocalStorage>>((previousValue, currentValue) => {
                 const readyName = encryptString(currentValue[0]) as keyof LocalStorage;
                 const item = JSON.parse(decryptString(currentValue[1]));

                 previousValue[readyName] = item;

                 return previousValue;
              }, {})
            : (items as any);
      } catch (error) {
         return undefined as any;
      }
   };

   return {
      setItem,
      getItem: (name) => {
         if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "generateLocalStorage.getItem"))
            return undefined as any;

         const localStoragePlugin = externalBetterHtmlContextValue.plugins.find(
            (plugin) => plugin.name === "localStorage",
         );

         if (!localStoragePlugin) {
            throw new Error(
               "`generateLocalStorage.getItem` function requires the `localStorage` plugin to be added to the `plugins` prop in `<BetterHtmlProvider>`.",
            );
         }

         const pluginConfig: LocalStoragePluginOptions = localStoragePlugin.getConfig();

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
      getAllItems,
      removeItem: (name) => {
         if (!checkBetterHtmlContextValue(externalBetterHtmlContextValue, "generateLocalStorage.removeItem"))
            return undefined as any;

         const localStoragePlugin = externalBetterHtmlContextValue.plugins.find(
            (plugin) => plugin.name === "localStorage",
         );

         if (!localStoragePlugin) {
            throw new Error(
               "`generateLocalStorage.removeItem` function requires the `localStorage` plugin to be added to the `plugins` prop in `<BetterHtmlProvider>`.",
            );
         }

         const pluginConfig: LocalStoragePluginOptions = localStoragePlugin.getConfig();

         const encryptionEnabled = pluginConfig.encryption?.enabled ?? false;

         const readyName = encryptionEnabled ? encryptString(name.toString()) : name;

         localStorage.removeItem(readyName.toString());
      },
      removeAllItems: (config) => {
         const allItems = getAllItems();

         localStorage.clear();

         if (config?.keepValues) {
            config.keepValues.forEach((key) => {
               setItem(key, allItems[key] as any);
            });
         }
      },
   };
}
