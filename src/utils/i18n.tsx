import { Fragment } from "react";

import { Language } from "../types/i18n";

import { externalBetterHtmlContextValue, useBetterHtmlContext } from "../components/BetterHtmlProvider";

export const missingTranslation = "MISSING_TRANSLATION";

export function generateI18n<Words extends object & { templates: Record<string, string> }>(config: {
   defaultLanguage: Language;
   languages: Record<
      Language,
      {
         code: Language;
         words: Words;
      }
   >;
}) {
   setTimeout(() => {
      const cachedLanguage = localStorage.getItem("language");
      const language =
         !cachedLanguage || !Object.keys(config.languages).includes(cachedLanguage)
            ? config.defaultLanguage
            : cachedLanguage;

      setLanguage(language);
   }, 1);

   function setLanguage(language: Language) {
      externalBetterHtmlContextValue?.setLanguage(language);
      localStorage.setItem("language", language);
   }

   function internalI18n(language: Language) {
      function translate<T extends Record<string, (text: string, index: number) => React.ReactNode>>(
         getString: (path: (typeof config.languages)[Language]["words"]) => string,
         template: T,
      ): React.ReactNode;

      function translate(getString: (path: (typeof config.languages)[Language]["words"]) => string): string;

      function translate<T extends Record<string, (text: string, index: number) => React.ReactNode> | undefined>(
         getString?: (path: (typeof config.languages)[Language]["words"]) => string,
         template?: T,
      ): string | React.ReactNode {
         const words = config.languages?.[language]?.words;

         try {
            const readyString = words ? (getString?.(words) ?? missingTranslation) : missingTranslation;

            if (!template) return readyString;

            const matches = Array.from(readyString.matchAll(/{([^}]+)}/g));
            if (matches.length === 0) return readyString;

            const parts: React.ReactNode[] = [];

            let lastIndex = 0;
            matches.forEach((match, index) => {
               const [fullMatch, key] = match;
               const startIndex = match.index!;

               if (startIndex > lastIndex) parts.push(readyString.substring(lastIndex, startIndex));

               const readyKey = words.templates[key.trim()] ?? fullMatch;

               const handler = template[key.trim()];
               parts.push(handler ? <Fragment key={fullMatch}>{handler(readyKey, index)}</Fragment> : fullMatch);

               lastIndex = startIndex + fullMatch.length;
            });

            if (lastIndex < readyString.length) parts.push(readyString.substring(lastIndex));

            return parts;
         } catch (error) {
            return <>{missingTranslation}</>;
         }
      }

      return {
         t: translate,
         language,
         setLanguage,
      };
   }

   return {
      useI18n: () => {
         const { language } = useBetterHtmlContext();

         return {
            ...internalI18n(language ?? config.defaultLanguage),
         };
      },
      ...internalI18n(externalBetterHtmlContextValue?.language ?? config.defaultLanguage),
      ...config,
   };
}
