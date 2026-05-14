import { HttpHeaders, HttpMethod } from "./http";

export type API<APIConfig> = Record<
   keyof APIConfig,
   {
      method: HttpMethod;
      path: `/${string}`;
      bodyWithFormData?: boolean;
      includeHeaders?: (keyof HttpHeaders)[];
   }
>;

export type APIConfigItem = {
   body: any;
   response: any;
   path?: (string | number)[];
   query?: UrlQuery;
};

export type UrlQuery = Record<string, string | number | boolean | (string | number)[]>;

export type APIResponse<Data> = {
   data: Data;
   headers: Headers;
   statusCode: number;
   statusText: string;
   url: string;
   ok: boolean;
   redirected: boolean;
};
