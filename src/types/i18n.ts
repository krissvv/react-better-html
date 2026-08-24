export type Language = string;

export type LanguageData<Words> = {
   name: string;
   code: Language;
   words: Words;
   flagCode: string;
};
