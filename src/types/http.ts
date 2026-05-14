import { AnyOtherString } from "react-better-core";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | "TRACE" | "CONNECT";

type CacheDirective =
   | "no-cache"
   | "no-store"
   | "no-transform"
   | "only-if-cached"
   | "max-age"
   | "max-stale"
   | "min-fresh"
   | "must-revalidate"
   | "must-understand"
   | "proxy-revalidate"
   | "private"
   | "public"
   | "s-maxage"
   | "immutable"
   | "stale-while-revalidate"
   | "stale-if-error";

type ConnectionDirective = "keep-alive" | "close" | "upgrade";

type ContentEncoding = "gzip" | "compress" | "deflate" | "br" | "identity" | "zstd";

type MediaType =
   | "text/plain"
   | "text/html"
   | "text/css"
   | "text/javascript"
   | "text/csv"
   | "text/xml"
   | "application/json"
   | "application/ld+json"
   | "application/xml"
   | "application/octet-stream"
   | "application/pdf"
   | "application/zip"
   | "application/gzip"
   | "application/x-www-form-urlencoded"
   | "application/x-ndjson"
   | "multipart/form-data"
   | "multipart/byteranges"
   | "image/png"
   | "image/jpeg"
   | "image/gif"
   | "image/webp"
   | "image/svg+xml"
   | "image/avif"
   | "audio/mpeg"
   | "audio/ogg"
   | "audio/wav"
   | "video/mp4"
   | "video/ogg"
   | "video/webm"
   | "font/woff"
   | "font/woff2"
   | "font/ttf"
   | (string & {});

type AuthScheme =
   | `Basic ${string}`
   | `Bearer ${string}`
   | `Digest ${string}`
   | `NTLM ${string}`
   | `Negotiate ${string}`
   | `AWS4-HMAC-SHA256 ${string}`
   | AnyOtherString;

type ReferrerPolicy =
   | "no-referrer"
   | "no-referrer-when-downgrade"
   | "origin"
   | "origin-when-cross-origin"
   | "same-origin"
   | "strict-origin"
   | "strict-origin-when-cross-origin"
   | "unsafe-url";

type CrossOriginEmbedderPolicy = "unsafe-none" | "require-corp" | "credentialless";

type CrossOriginOpenerPolicy = "unsafe-none" | "same-origin-allow-popups" | "same-origin";

type CrossOriginResourcePolicy = "same-site" | "same-origin" | "cross-origin";

type FetchSite = "cross-site" | "same-origin" | "same-site" | "none";
type FetchMode = "cors" | "navigate" | "no-cors" | "same-origin" | "websocket";
type FetchDest =
   | "audio"
   | "audioworklet"
   | "document"
   | "embed"
   | "empty"
   | "font"
   | "frame"
   | "iframe"
   | "image"
   | "manifest"
   | "object"
   | "paintworklet"
   | "report"
   | "script"
   | "serviceworker"
   | "sharedworker"
   | "style"
   | "track"
   | "video"
   | "worker"
   | "xslt";

type TransferEncoding = "chunked" | "compress" | "deflate" | "gzip" | "identity";

type Preference = "respond-async" | "return=minimal" | "return=representation";

export type HttpHeaders = {
   // ── Authentication ───────────────────────────────────────────────────────
   /** Credentials to authenticate with the server. */
   Authorization?: AuthScheme;
   /** Credentials to authenticate with a proxy. */
   "Proxy-Authorization"?: AuthScheme;
   /** Which authentication methods can be used to gain access to a resource. */
   "WWW-Authenticate"?: string;
   /** Which authentication method should be used to gain access to a proxy. */
   "Proxy-Authenticate"?: string;

   // ── Caching ──────────────────────────────────────────────────────────────
   /** Directives for caching mechanisms in both requests and responses. */
   "Cache-Control"?: CacheDirective | `${CacheDirective}, ${string}` | AnyOtherString;
   /** Clears browse caching and related effects for a specific response. */
   "Clear-Site-Data"?: '"cache"' | '"cookies"' | '"storage"' | '"executionContexts"' | '"*"' | AnyOtherString;
   /** Age in seconds the object has been in a proxy cache. */
   Age?: `${number}`;
   /** Date/time after which the response is considered stale. */
   Expires?: string;
   /** Implementation-specific directives. */
   Pragma?: "no-cache" | AnyOtherString;

   // ── Conditionals ─────────────────────────────────────────────────────────
   /** Makes the request conditional; only transmit if content has changed. */
   "Last-Modified"?: string;
   /** Identifier for a specific version of a resource. */
   ETag?: `"${string}"` | `W/"${string}"`;
   /** Makes the request conditional on the ETag matching. */
   "If-Match"?: `"${string}"` | "*";
   /** Makes the request conditional on the ETag NOT matching. */
   "If-None-Match"?: `"${string}"` | "*";
   /** Makes the request conditional on the date. */
   "If-Modified-Since"?: string;
   /** Makes the request conditional on the date (for unchanged resources). */
   "If-Unmodified-Since"?: string;
   /** Used with range requests to send missing parts only if unchanged. */
   "If-Range"?: `"${string}"` | string;

   // ── Connection ───────────────────────────────────────────────────────────
   /** Controls whether the network connection stays open after the transaction. */
   Connection?: ConnectionDirective | AnyOtherString;
   /** Controls how long a persistent connection stays open (in seconds). */
   "Keep-Alive"?: string;

   // ── Content negotiation ──────────────────────────────────────────────────
   /** Informs the server about the types of data that can be sent back. */
   Accept?: MediaType | `${MediaType};q=${number}` | "*/*" | AnyOtherString;
   /** Which content encoding the client can understand. */
   "Accept-Encoding"?: ContentEncoding | AnyOtherString;
   /** Which languages the client prefers. */
   "Accept-Language"?: string;
   /** Indicates whether the client can handle HTTP/1.1 chunked transfer encoding. */
   TE?: TransferEncoding | AnyOtherString;

   // ── Controls ─────────────────────────────────────────────────────────────
   /** Indicates expectations that need to be fulfilled by the server. */
   Expect?: "100-continue";
   /** The maximum number of seconds the resource is expected to take to arrive. */
   "Max-Forwards"?: `${number}`;

   // ── Cookies ──────────────────────────────────────────────────────────────
   /** Sends stored HTTP cookies associated with the server. */
   Cookie?: string;
   /** Sends a cookie from the server to the user-agent. */
   "Set-Cookie"?: string;

   // ── CORS ─────────────────────────────────────────────────────────────────
   /** Indicates where a fetch originates from. */
   Origin?: string;
   /** Indicates whether the response can be shared with requesting code from the given origin. */
   "Access-Control-Allow-Origin"?: "*" | AnyOtherString;
   /** Indicates whether the response to the request can be exposed when credentials are present. */
   "Access-Control-Allow-Credentials"?: "true";
   /** Used in response to a preflight request to indicate which headers can be used. */
   "Access-Control-Allow-Headers"?: "*" | AnyOtherString;
   /** Specifies the methods allowed when accessing the resource in response to a preflight. */
   "Access-Control-Allow-Methods"?: "*" | HttpMethod | AnyOtherString;
   /** Indicates which headers can be exposed as part of the response. */
   "Access-Control-Expose-Headers"?: "*" | AnyOtherString;
   /** Indicates how long the results of a preflight request can be cached. */
   "Access-Control-Max-Age"?: `${number}`;
   /** Used when issuing a preflight request to let the server know HTTP method will be used. */
   "Access-Control-Request-Headers"?: string;
   /** Used when issuing a preflight request to let the server know HTTP method will be used. */
   "Access-Control-Request-Method"?: HttpMethod;

   // ── Downloads ────────────────────────────────────────────────────────────
   /** Indicates if the resource should be downloaded or displayed inline. */
   "Content-Disposition"?:
      | "inline"
      | "attachment"
      | `attachment; filename="${string}"`
      | `form-data; name="${string}"`
      | AnyOtherString;

   // ── Message body information ─────────────────────────────────────────────
   /** The size of the resource in bytes. */
   "Content-Length"?: `${number}`;
   /** Indicates the media type of the resource. */
   "Content-Type"?: MediaType | `${MediaType}; charset=${string}` | `${MediaType}; boundary=${string}` | AnyOtherString;
   /** The encoding used on the data. */
   "Content-Encoding"?: ContentEncoding;
   /** Describes the human language(s) intended for the audience. */
   "Content-Language"?: string;
   /** Indicates an alternate location for the returned data. */
   "Content-Location"?: string;

   // ── Proxies ──────────────────────────────────────────────────────────────
   /** Contains information from the client-facing side of proxy servers. */
   Forwarded?: string;
   /** The originating IP address of a client connecting through a proxy. */
   "X-Forwarded-For"?: string;
   /** The original host requested by the client. */
   "X-Forwarded-Host"?: string;
   /** The protocol the client used to connect to the proxy. */
   "X-Forwarded-Proto"?: "http" | "https";
   /** Added by proxies, both forward and reverse, for tracing. */
   Via?: string;

   // ── Redirects ────────────────────────────────────────────────────────────
   /** Indicates the URL to redirect a page to. */
   Location?: string;
   /** Identifies the most recent version of the resource in the context of an HTTP PUT. */
   "Content-Location-URI"?: string;

   // ── Request context ──────────────────────────────────────────────────────
   /** Contains an Internet email address for a human user who controls the requesting user agent. */
   From?: string;
   /** The domain name of the server (for virtual hosting). */
   Host?: string;
   /** The address of the previous web page from which a link was followed. */
   Referer?: string;
   /** Governs which referrer information should be included with requests made. */
   "Referrer-Policy"?: ReferrerPolicy;
   /** Contains a characteristic string that allows network protocol peers to identify the application. */
   "User-Agent"?: string;

   // ── Response context ─────────────────────────────────────────────────────
   /** Lists the set of HTTP request methods supported by the server. */
   Allow?: HttpMethod | AnyOtherString;
   /** Contains information about the software used by the origin server. */
   Server?: string;
   /** Indicates the date and time at which the message was originated. */
   Date?: string;

   // ── Range requests ───────────────────────────────────────────────────────
   /** Indicates if the server supports range requests, and if so what type. */
   "Accept-Ranges"?: "bytes" | "none";
   /** Indicates the part of a document that the server should return. */
   Range?: `bytes=${number}-${number}` | `bytes=${number}-` | AnyOtherString;
   /** Indicates where in a full body message a partial message belongs. */
   "Content-Range"?: `bytes ${number}-${number}/${number}` | `bytes */${number}` | AnyOtherString;

   // ── Security ─────────────────────────────────────────────────────────────
   /** Allows a site to opt in to reporting and/or enforcement of Certificate Transparency. */
   "Expect-CT"?: string;
   /** Provides a mechanism to allow and deny the use of browser features. */
   "Permissions-Policy"?: string;
   /** Allows servers to indicate that a content type should not be changed or followed. */
   "X-Content-Type-Options"?: "nosniff";
   /** Indicates whether a browser should be allowed to render a page in a <frame>, <iframe>, etc. */
   "X-Frame-Options"?: "DENY" | "SAMEORIGIN" | `ALLOW-FROM ${string}`;
   /** Enables cross-site scripting filtering (legacy). */
   "X-XSS-Protection"?: "0" | "1" | "1; mode=block" | `1; report=${string}`;
   /** Sends a signal to the server expressing the client's preference for an encrypted connection. */
   "Upgrade-Insecure-Requests"?: "1";
   /** Forces communication over HTTPS instead of HTTP. */
   "Strict-Transport-Security"?:
      | `max-age=${number}`
      | `max-age=${number}; includeSubDomains`
      | `max-age=${number}; includeSubDomains; preload`;
   /** Indicates how a document may be loaded into a cross-origin document. */
   "X-Permitted-Cross-Domain-Policies"?: "none" | "master-only" | "by-content-type" | "all";
   /** Allows a server to define a policy to protect against certain types of attacks. */
   "Content-Security-Policy"?: string;
   /** Allows web developers to experiment with policies without enforcing them. */
   "Content-Security-Policy-Report-Only"?: string;
   /** Allows web developers to associate a specific cryptographic identity with a server. */
   "Public-Key-Pins"?: string;
   /** Sends reports of pinning violations but, unlike PKP, still allows browsers to connect. */
   "Public-Key-Pins-Report-Only"?: string;

   // ── Cross-Origin isolation ────────────────────────────────────────────────
   "Cross-Origin-Embedder-Policy"?: CrossOriginEmbedderPolicy;
   "Cross-Origin-Opener-Policy"?: CrossOriginOpenerPolicy;
   "Cross-Origin-Resource-Policy"?: CrossOriginResourcePolicy;

   // ── Server-sent hints ─────────────────────────────────────────────────────
   /**
    * Used to send resources to the client before the server is aware they will be needed.
    * Example: `</style.css>; rel=preload; as=style`
    */
   Link?: string;

   // ── Transfer coding ──────────────────────────────────────────────────────
   /** Specifies the form of encoding used to safely transfer the payload body. */
   "Transfer-Encoding"?: TransferEncoding | AnyOtherString;
   /** Allows the sender to include additional fields at the end of chunked messages. */
   Trailer?: string;

   // ── WebSockets ───────────────────────────────────────────────────────────
   /** Upgrade from HTTP to a different protocol (e.g. WebSocket). */
   Upgrade?: "websocket" | "HTTP/2.0" | AnyOtherString;
   /** Used in the WebSocket opening handshake. */
   "Sec-WebSocket-Key"?: string;
   /** Used in the WebSocket opening handshake (server side). */
   "Sec-WebSocket-Accept"?: string;
   /** Specifies one or more protocols the client wishes to use. */
   "Sec-WebSocket-Protocol"?: string;
   /** Specifies the version of the WebSocket protocol. */
   "Sec-WebSocket-Version"?: "13" | AnyOtherString;
   /** WebSocket extensions negotiated. */
   "Sec-WebSocket-Extensions"?: string;

   // ── Fetch metadata ───────────────────────────────────────────────────────
   /** Indicates the relationship between a request initiator's origin and its target's origin. */
   "Sec-Fetch-Site"?: FetchSite;
   /** Indicates the mode of the request. */
   "Sec-Fetch-Mode"?: FetchMode;
   /** Indicates whether the request is for an image destined for storage in a cache. */
   "Sec-Fetch-User"?: "?1";
   /** Indicates the request's destination. */
   "Sec-Fetch-Dest"?: FetchDest;

   // ── Client hints ─────────────────────────────────────────────────────────
   /** Indicates the user's preference for reduced data usage. */
   "Save-Data"?: "on" | "off";
   /** Notifies the server about the network quality and conditions. */
   Downlink?: `${number}`;
   /** Notifies the server about the estimated effective connection type. */
   ECT?: "slow-2g" | "2g" | "3g" | "4g";
   /** Notifies the server about the estimated round-trip latency. */
   RTT?: `${number}`;
   /** Indicates the width of the device in CSS pixels. */
   "Viewport-Width"?: `${number}`;
   /** The DPR (Device Pixel Ratio) of the client's device. */
   DPR?: `${number}`;
   /** Indicates the device pixel ratio. */
   "Device-Memory"?: "0.25" | "0.5" | "1" | "2" | "4" | "8";

   // ── Server hints ─────────────────────────────────────────────────────────
   /** Indicates the hints the server is able to use proactively. */
   "Accept-CH"?: string;
   /** Ensures a client hint can be securely sent. */
   "Critical-CH"?: string;

   // ── Timing ───────────────────────────────────────────────────────────────
   /** Indicates the preferences used for the communication channel to a server. */
   "Server-Timing"?: string;
   /** Used to deliver a reduced or sanitized Timing-Allow-Origin header. */
   "Timing-Allow-Origin"?: "*" | AnyOtherString;

   // ── Misc / widely-used non-standard ──────────────────────────────────────
   /** Preferred server behavior in request processing. */
   Prefer?: Preference | AnyOtherString;
   /** The unique ID of a request, for tracing across services. */
   "X-Request-Id"?: string;
   "X-Correlation-Id"?: string;
   "X-Trace-Id"?: string;
   /** Distinguishes AJAX from non-AJAX requests in some frameworks. */
   "X-Requested-With"?: "XMLHttpRequest" | AnyOtherString;
   /** Identifies the originating IP when behind a load balancer. */
   "X-Real-IP"?: string;

   [header: `x-${string}`]: string | undefined;
};
