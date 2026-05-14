import { API, APIConfigItem, APIResponse } from "../types/api";
import { HttpHeaders, HttpMethod } from "../types/http";

import { constructQuery } from "./functions";
import { log } from "./logger";

const methodInitiateToString: Record<HttpMethod, string> = {
   GET: "GET request to      ",
   PUT: "PUT request to      ",
   POST: "POST request to     ",
   PATCH: "PATCH request to    ",
   DELETE: "DELETE request to   ",
   HEAD: "HEAD request to     ",
   OPTIONS: "OPTIONS request to  ",
   TRACE: "TRACE request to    ",
   CONNECT: "CONNECT request to  ",
};

const methodResponseToString: Record<HttpMethod, string> = {
   GET: "GET request from    ",
   PUT: "PUT request from    ",
   POST: "POST request from   ",
   PATCH: "PATCH request from  ",
   DELETE: "DELETE request from ",
   HEAD: "HEAD request from   ",
   OPTIONS: "OPTIONS request from",
   TRACE: "TRACE request from  ",
   CONNECT: "CONNECT request from",
};

export function generateApi<
   APIConfig extends Record<string, APIConfigItem>,
   APIHeaders extends HttpHeaders = HttpHeaders,
>(
   config: {
      /**
       * Do not add a trailing slash
       */
      baseUrl: string;
   },
   apiConfig: API<APIConfig>,
   getHeaders?: {
      [HeaderName in keyof APIHeaders]?: () => APIHeaders[HeaderName];
   },
) {
   return async function apiCall<EndpointName extends keyof APIConfig>(
      name: EndpointName,
      payload: {
         query?: APIConfig[EndpointName]["query"];
         body?: APIConfig[EndpointName]["body"];
         path?: APIConfig[EndpointName]["path"];
      } = {},
   ): Promise<APIResponse<APIConfig[EndpointName]["response"]>> {
      if (!apiConfig[name]) {
         return Promise.reject(
            new Error(`Endpoint ${name.toString()} is not defined in the \`generateApi\` function.`, {
               cause: "generateApi.apiConfig.missingEndpoint",
            }),
         );
      }

      const baseURL = config.baseUrl;
      const path = `${apiConfig[name].path}${payload.path?.length ? `/${payload.path.join("/")}` : ""}`;
      const query = constructQuery(payload.query);
      const url = `${baseURL}${path}${query ? `?${query}` : ""}`;

      const requestHeaders: HttpHeaders = {
         "Content-Type": apiConfig[name].bodyWithFormData ? "multipart/form-data" : "application/json",
         ...(getHeaders
            ? Object.entries(getHeaders).reduce<HttpHeaders>((previousValue, [key, value]) => {
                 if (apiConfig[name].includeHeaders?.includes(key as keyof HttpHeaders)) {
                    previousValue[key as keyof HttpHeaders] = value?.();
                 }

                 return previousValue;
              }, {})
            : {}),
      };

      const body = payload.body;
      const bodyAsFormData = new FormData();

      if (body && apiConfig[name].bodyWithFormData) {
         Object.entries(body).forEach(([key, value]) => {
            bodyAsFormData.append(key, value as string | Blob);
         });
      }

      const readyBody = JSON.stringify((apiConfig[name].bodyWithFormData ? bodyAsFormData : body) ?? {});

      log.log(`Initiate ${methodInitiateToString[apiConfig[name].method]} ${url} - ${name.toString()}`, {
         color: "magenta",
      });

      return await call(() =>
         fetch(url, {
            method: apiConfig[name].method,
            body: apiConfig[name].method !== "GET" ? readyBody : undefined,
            headers: requestHeaders as any,
         }),
      );

      async function call(
         callAction: () => Promise<Response>,
      ): Promise<APIResponse<Promise<APIConfig[EndpointName]["response"]>>> {
         const response = await callAction();
         const responseJson = await response.json();

         log.log(`Response ${methodResponseToString[apiConfig[name].method]} ${url} - ${name.toString()}`, {
            color: "blue",
         });

         return {
            data: responseJson,
            headers: response.headers,
            statusCode: response.status,
            statusText: response.statusText,
            url: response.url,
            ok: response.ok,
            redirected: response.redirected,
         };
      }
   };
}
