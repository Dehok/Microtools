"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

interface StatusCode {
  code: number;
  name: string;
  description: string;
  details: string;
}

interface CategoryInfo {
  label: string;
  range: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  headerBg: string;
  headerText: string;
}

const CATEGORIES: Record<string, CategoryInfo> = {
  "1xx": {
    label: "1xx Informational",
    range: "1",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    headerBg: "bg-blue-600",
    headerText: "text-white",
  },
  "2xx": {
    label: "2xx Success",
    range: "2",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    badgeBg: "bg-green-100",
    badgeText: "text-green-800",
    headerBg: "bg-green-600",
    headerText: "text-white",
  },
  "3xx": {
    label: "3xx Redirection",
    range: "3",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-800",
    headerBg: "bg-yellow-500",
    headerText: "text-white",
  },
  "4xx": {
    label: "4xx Client Error",
    range: "4",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-800",
    headerBg: "bg-orange-500",
    headerText: "text-white",
  },
  "5xx": {
    label: "5xx Server Error",
    range: "5",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    badgeBg: "bg-red-100",
    badgeText: "text-red-800",
    headerBg: "bg-red-600",
    headerText: "text-white",
  },
};

const STATUS_CODES: StatusCode[] = [
  // 1xx Informational
  {
    code: 100,
    name: "Continue",
    description: "The server has received the request headers and the client should proceed to send the request body.",
    details: "This interim response indicates that the client should continue the request or ignore the response if the request is already finished. It is typically used when the client sends an Expect: 100-continue header and the server agrees to accept the request body.",
  },
  {
    code: 101,
    name: "Switching Protocols",
    description: "The server is switching to a different protocol as requested by the client via the Upgrade header.",
    details: "This response is sent when the server agrees to switch protocols. The most common use case is upgrading an HTTP/1.1 connection to WebSocket. The server sends this status along with an Upgrade header indicating the new protocol.",
  },
  {
    code: 102,
    name: "Processing",
    description: "The server has received and is processing the request, but no response is available yet.",
    details: "This status code is defined in WebDAV (RFC 2518). It indicates that the server has received the request and is still processing it. This prevents the client from timing out and assuming the request was lost.",
  },
  {
    code: 103,
    name: "Early Hints",
    description: "Used to return some response headers before the final HTTP message, allowing the browser to preload resources.",
    details: "This status code is primarily intended to be used with the Link header to allow the user agent to start preloading resources while the server prepares a response. It helps improve page load performance by enabling early resource fetching.",
  },

  // 2xx Success
  {
    code: 200,
    name: "OK",
    description: "The request has succeeded. The meaning depends on the HTTP method used.",
    details: "This is the standard response for successful HTTP requests. For GET requests, the response contains the requested resource. For POST requests, the response contains the result of the action. It is the most common HTTP status code.",
  },
  {
    code: 201,
    name: "Created",
    description: "The request has succeeded and a new resource has been created as a result.",
    details: "This is typically the response sent after POST requests or some PUT requests. The new resource is returned in the body of the response, and its location is provided via the Location header or the request URL itself.",
  },
  {
    code: 202,
    name: "Accepted",
    description: "The request has been accepted for processing, but the processing has not been completed.",
    details: "This response is used for asynchronous operations. The request may or may not eventually be acted upon, as it might be disallowed when processing actually takes place. It is non-committal and is useful for batch processing or queued operations.",
  },
  {
    code: 203,
    name: "Non-Authoritative Information",
    description: "The returned metadata is not exactly the same as available from the origin server.",
    details: "This status code means the request was successful but the enclosed payload has been modified by a transforming proxy from the origin server's 200 OK response. It is commonly used by proxies that modify response headers or body.",
  },
  {
    code: 204,
    name: "No Content",
    description: "The server has successfully fulfilled the request and there is no additional content to send.",
    details: "This response is commonly used for DELETE requests or PUT requests where the update is successful but no content needs to be returned. The response must not include a message body, and browsers will not update their document view.",
  },
  {
    code: 205,
    name: "Reset Content",
    description: "The server has fulfilled the request and the client should reset the document view.",
    details: "This is similar to 204 No Content but requires the requester to reset the document view. It is useful for form submission flows where the form should be cleared after successful submission. Like 204, it must not include a message body.",
  },
  {
    code: 206,
    name: "Partial Content",
    description: "The server is delivering only part of the resource due to a Range header sent by the client.",
    details: "This response is used when the client requests only a portion of a resource using the Range header. It is commonly used for resumable downloads, video streaming, and PDF viewing. The Content-Range header indicates which part of the full resource is included.",
  },
  {
    code: 207,
    name: "Multi-Status",
    description: "Conveys information about multiple resources in situations where multiple status codes might be appropriate.",
    details: "Defined in WebDAV (RFC 4918), this response provides status for multiple independent operations. The response body is an XML document containing individual response elements for each sub-request. It is used when a single request affects multiple resources.",
  },
  {
    code: 208,
    name: "Already Reported",
    description: "Used inside a DAV: propstat response to avoid enumerating the same resource multiple times.",
    details: "Defined in WebDAV Binding Extensions (RFC 5842), this status code is used to avoid listing internal members of multiple bindings to the same collection repeatedly. It prevents infinite loops when dealing with recursive directory structures in WebDAV.",
  },
  {
    code: 226,
    name: "IM Used",
    description: "The server has fulfilled a GET request with instance-manipulations applied to the current instance.",
    details: "Defined in RFC 3229 (Delta Encoding in HTTP), this status indicates that the server is returning a delta (difference) rather than the full resource. The response is the result of one or more instance-manipulations applied to the current instance.",
  },

  // 3xx Redirection
  {
    code: 300,
    name: "Multiple Choices",
    description: "The request has more than one possible response and the user or user agent should choose one.",
    details: "This response indicates that the requested resource corresponds to multiple representations, each with its own specific location. The server may include a preferred choice in the Location header. It is rarely used in practice.",
  },
  {
    code: 301,
    name: "Moved Permanently",
    description: "The resource has been permanently moved to a new URL. All future requests should use the new URL.",
    details: "This is one of the most important status codes for SEO. Search engines will transfer the ranking signals to the new URL. Browsers and clients should automatically redirect to the new URL specified in the Location header for all future requests.",
  },
  {
    code: 302,
    name: "Found",
    description: "The resource temporarily resides at a different URI. The client should continue to use the original URI for future requests.",
    details: "Originally defined as 'Moved Temporarily', this status code indicates a temporary redirect. Unlike 301, search engines will not transfer ranking signals to the new URL. Some older clients incorrectly change POST to GET on redirect, which led to the creation of 307.",
  },
  {
    code: 303,
    name: "See Other",
    description: "The response can be found at a different URI using a GET method.",
    details: "This status code is used to redirect the client to a different resource using a GET request, regardless of the original request method. It is commonly used after a POST request to redirect the user to a confirmation page, preventing duplicate form submissions on refresh.",
  },
  {
    code: 304,
    name: "Not Modified",
    description: "The resource has not been modified since the last request. The client can use its cached version.",
    details: "This response is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version. It is sent when the request includes If-Modified-Since or If-None-Match headers and the resource hasn't changed.",
  },
  {
    code: 307,
    name: "Temporary Redirect",
    description: "The resource temporarily resides at a different URI. The request method must not be changed.",
    details: "Similar to 302, but guarantees that the request method and body will not be changed when the redirect is followed. If the original request was POST, the redirected request must also be POST. This was introduced to fix the ambiguity of 302.",
  },
  {
    code: 308,
    name: "Permanent Redirect",
    description: "The resource has permanently moved and the request method must not be changed.",
    details: "Similar to 301, but guarantees that the request method and body will not change during the redirect. While 301 may cause some clients to change POST to GET, 308 explicitly requires the same method. Search engines treat this similarly to 301 for SEO purposes.",
  },

  // 4xx Client Error
  {
    code: 400,
    name: "Bad Request",
    description: "The server cannot process the request due to malformed syntax or invalid request parameters.",
    details: "This is a generic client error response indicating that the server cannot process the request due to something perceived to be a client error. This includes malformed request syntax, invalid request message framing, or deceptive request routing.",
  },
  {
    code: 401,
    name: "Unauthorized",
    description: "The request requires user authentication. The client must authenticate itself to get the requested response.",
    details: "Despite the name 'Unauthorized', this status code actually means 'Unauthenticated'. The client must include valid authentication credentials (such as a Bearer token or Basic auth) in the request. The server includes a WWW-Authenticate header describing the required authentication scheme.",
  },
  {
    code: 402,
    name: "Payment Required",
    description: "Reserved for future use. Originally intended for digital payment systems.",
    details: "This status code was created for future digital payment systems and is not widely used in a standardized way. Some APIs use it to indicate that a paid subscription or payment is required to access the resource. Its usage and semantics may evolve over time.",
  },
  {
    code: 403,
    name: "Forbidden",
    description: "The server understood the request but refuses to authorize it. Authentication will not help.",
    details: "Unlike 401, the server knows who the client is but the client does not have permission to access the resource. Re-authenticating will make no difference. This is commonly used for resources that require specific roles, permissions, or IP whitelisting.",
  },
  {
    code: 404,
    name: "Not Found",
    description: "The server cannot find the requested resource. The URL is not recognized.",
    details: "This is perhaps the most well-known HTTP status code. It indicates that the server cannot find the requested resource. In a browser, this means the URL is not recognized. In an API, it can mean the endpoint is valid but the specific resource does not exist.",
  },
  {
    code: 405,
    name: "Method Not Allowed",
    description: "The request method is not supported for the requested resource.",
    details: "The HTTP method used in the request is not allowed for the target resource. For example, sending a DELETE request to a read-only resource. The response must include an Allow header listing the supported methods for the resource.",
  },
  {
    code: 406,
    name: "Not Acceptable",
    description: "The server cannot produce a response matching the acceptable values defined in the request headers.",
    details: "This response is sent when the server cannot produce content that matches the criteria given by the client's Accept headers (Accept, Accept-Encoding, Accept-Language). It is part of HTTP content negotiation and is relatively uncommon in practice.",
  },
  {
    code: 407,
    name: "Proxy Authentication Required",
    description: "The client must first authenticate itself with the proxy before the request can proceed.",
    details: "Similar to 401 but indicates that the client needs to authenticate with an intermediate proxy. The proxy must return a Proxy-Authenticate header field containing a challenge describing the required authentication. This is common in corporate network environments.",
  },
  {
    code: 408,
    name: "Request Timeout",
    description: "The server timed out waiting for the request from the client.",
    details: "The server did not receive a complete request within the time it was prepared to wait. The client may repeat the request without modifications at any later time. Some servers send this on idle connections to signal the client that the connection will be closed.",
  },
  {
    code: 409,
    name: "Conflict",
    description: "The request conflicts with the current state of the server or resource.",
    details: "This response is sent when a request conflicts with the current state of the target resource. It is most commonly used in PUT requests when trying to update a resource that has been modified by another client (optimistic concurrency). It is also used for duplicate resource creation attempts.",
  },
  {
    code: 410,
    name: "Gone",
    description: "The requested resource is no longer available and no forwarding address is known.",
    details: "Unlike 404, this status code indicates that the resource was intentionally removed and will not be available again. It tells search engines to remove the page from their index. This is useful for expired promotions, deleted content, or decommissioned API endpoints.",
  },
  {
    code: 411,
    name: "Length Required",
    description: "The server requires the Content-Length header to be included in the request.",
    details: "The server refuses to accept the request without a defined Content-Length header. The client may repeat the request after adding a valid Content-Length header field. This is used by servers that need to know the request body size before processing.",
  },
  {
    code: 412,
    name: "Precondition Failed",
    description: "One or more conditions given in the request headers evaluated to false on the server.",
    details: "The server does not meet one of the preconditions specified in the request headers (such as If-Match, If-Unmodified-Since). This is used for conditional requests to prevent lost updates and ensure safe concurrent modifications.",
  },
  {
    code: 413,
    name: "Payload Too Large",
    description: "The request entity is larger than the server is willing or able to process.",
    details: "The server refuses to process the request because the request payload is larger than the server's defined limits. The server may close the connection to prevent the client from continuing the request. Common limits apply to file uploads, JSON payloads, and form submissions.",
  },
  {
    code: 414,
    name: "URI Too Long",
    description: "The URI requested by the client is longer than the server is willing to interpret.",
    details: "This rare condition usually occurs when a client has converted a POST request to a GET request with long query information, or when a redirect loop creates an ever-growing URL. Most servers have a URI length limit of 8,192 bytes, though this varies.",
  },
  {
    code: 415,
    name: "Unsupported Media Type",
    description: "The media format of the requested data is not supported by the server.",
    details: "The server refuses the request because the payload format is not supported. This occurs when the Content-Type or Content-Encoding of the request is not recognized. For example, sending XML to an endpoint that only accepts JSON.",
  },
  {
    code: 416,
    name: "Range Not Satisfiable",
    description: "The range specified in the Range header of the request cannot be fulfilled.",
    details: "This status code is returned when the server cannot serve the requested byte range. This typically happens when the Range header value doesn't overlap with the resource's extent (e.g., requesting bytes beyond the file size). The Content-Range header indicates the actual resource range.",
  },
  {
    code: 417,
    name: "Expectation Failed",
    description: "The server cannot meet the requirements of the Expect request-header field.",
    details: "This response is sent when the server cannot meet the expectation indicated by the Expect request header. The most common case is when a client sends Expect: 100-continue but the server decides the request will fail and doesn't want to receive the body.",
  },
  {
    code: 418,
    name: "I'm a Teapot",
    description: "The server refuses to brew coffee because it is, permanently, a teapot.",
    details: "Defined in RFC 2324 (Hyper Text Coffee Pot Control Protocol) as an April Fools' joke, this status code is not expected to be implemented by actual HTTP servers. However, some servers use it as an Easter egg. It has become a beloved part of internet culture.",
  },
  {
    code: 422,
    name: "Unprocessable Entity",
    description: "The server understands the request but cannot process the contained instructions.",
    details: "Originally defined in WebDAV (RFC 4918), this status code has become widely used in REST APIs. It indicates that the server understands the content type and syntax of the request, but the contained instructions are semantically erroneous (e.g., validation errors on form fields).",
  },
  {
    code: 425,
    name: "Too Early",
    description: "The server is unwilling to risk processing a request that might be replayed.",
    details: "This status code indicates that the server is unwilling to process a request because it might be replayed, creating the risk of a replay attack. It is primarily used with TLS 1.3 early data (0-RTT) to protect against potential security risks.",
  },
  {
    code: 426,
    name: "Upgrade Required",
    description: "The server refuses to perform the request using the current protocol.",
    details: "The server indicates that the client should switch to a different protocol. The server sends an Upgrade header to indicate the required protocol(s). This is commonly used to require clients to upgrade from HTTP/1.1 to HTTP/2 or to use TLS.",
  },
  {
    code: 428,
    name: "Precondition Required",
    description: "The server requires the request to be conditional to prevent lost update conflicts.",
    details: "The origin server requires the request to include conditional headers such as If-Match. This is intended to prevent the 'lost update' problem where a client GETs a resource, modifies it, and PUTs it back while another client has also modified the resource.",
  },
  {
    code: 429,
    name: "Too Many Requests",
    description: "The user has sent too many requests in a given amount of time (rate limiting).",
    details: "The user has been rate-limited and should wait before making additional requests. The response may include a Retry-After header indicating how long to wait before making a new request. This is widely used in APIs to prevent abuse and ensure fair usage.",
  },
  {
    code: 431,
    name: "Request Header Fields Too Large",
    description: "The server refuses the request because the header fields are too large.",
    details: "The server is unwilling to process the request because its header fields are too large, either individually or collectively. This can happen when cookies become too large, or when there are too many custom headers. The client may retry with smaller header fields.",
  },
  {
    code: 451,
    name: "Unavailable For Legal Reasons",
    description: "The resource is unavailable due to legal demands such as censorship or government-mandated blocking.",
    details: "Named after Ray Bradbury's novel Fahrenheit 451, this status code indicates that the user is requesting a resource that is not available due to legal reasons, such as a web page that has been censored by a government. The response should include an explanation of the legal restriction.",
  },

  // 5xx Server Error
  {
    code: 500,
    name: "Internal Server Error",
    description: "The server encountered an unexpected condition that prevented it from fulfilling the request.",
    details: "This is a generic catch-all error response when the server encounters an unhandled exception or error. It indicates a problem on the server side, not with the client's request. Common causes include unhandled exceptions, database connection failures, or misconfigured servers.",
  },
  {
    code: 501,
    name: "Not Implemented",
    description: "The server does not support the functionality required to fulfill the request.",
    details: "The server either does not recognize the request method or lacks the ability to fulfill the request. This usually implies future availability, unlike 405 which indicates the method is known but not allowed for the specific resource. It is appropriate for methods the server doesn't support at all.",
  },
  {
    code: 502,
    name: "Bad Gateway",
    description: "The server acting as a gateway received an invalid response from the upstream server.",
    details: "This error response indicates that the server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request. Common in reverse proxy setups like Nginx, load balancers, or CDN configurations.",
  },
  {
    code: 503,
    name: "Service Unavailable",
    description: "The server is not ready to handle the request, typically due to maintenance or overloading.",
    details: "The server is currently unable to handle the request due to temporary overloading or scheduled maintenance. The response should include a Retry-After header suggesting when the client should retry. This is the appropriate response during planned downtime or traffic spikes.",
  },
  {
    code: 504,
    name: "Gateway Timeout",
    description: "The server acting as a gateway did not receive a timely response from the upstream server.",
    details: "Similar to 502, but specifically indicates a timeout. The gateway or proxy server did not receive a response from the upstream server within the configured time limit. Common causes include slow backend services, network issues, or database query timeouts.",
  },
  {
    code: 505,
    name: "HTTP Version Not Supported",
    description: "The server does not support the HTTP protocol version used in the request.",
    details: "The server does not support or refuses to support the major version of HTTP that was used in the request. This is relatively rare in practice since most servers support HTTP/1.0, HTTP/1.1, and HTTP/2. The server should generate a response explaining why that version is not supported.",
  },
  {
    code: 506,
    name: "Variant Also Negotiates",
    description: "The server has an internal configuration error during transparent content negotiation.",
    details: "Defined in RFC 2295, this status code indicates that the chosen variant resource is configured to engage in transparent content negotiation itself, creating a circular reference. This is a server misconfiguration error that is rarely encountered in practice.",
  },
  {
    code: 507,
    name: "Insufficient Storage",
    description: "The server is unable to store the representation needed to complete the request.",
    details: "Defined in WebDAV (RFC 4918), this status code means the server cannot store the resource needed to successfully complete the request. It indicates that the server has run out of disk space or has exceeded a storage quota. The client should not retry until the condition is resolved.",
  },
  {
    code: 508,
    name: "Loop Detected",
    description: "The server detected an infinite loop while processing the request.",
    details: "Defined in WebDAV Binding Extensions (RFC 5842), this status code indicates that the server terminated an operation because it encountered an infinite loop while processing a request with 'Depth: infinity'. This is specific to WebDAV operations involving recursive directory traversal.",
  },
  {
    code: 510,
    name: "Not Extended",
    description: "Further extensions to the request are required for the server to fulfill it.",
    details: "Defined in RFC 2774, this status code indicates that the client request declares an HTTP Extension that should be used to process the request, but the extension is not supported. The server needs additional information from the client to fulfill the request.",
  },
  {
    code: 511,
    name: "Network Authentication Required",
    description: "The client needs to authenticate to gain network access, often used by captive portals.",
    details: "This status code indicates that the client needs to authenticate to gain network access. It is typically generated by intercepting proxies (captive portals) used to control access to the network, such as Wi-Fi hotspots at airports, hotels, or cafes that require login or acceptance of terms.",
  },
];

function getCategoryKey(code: number): string {
  return `${Math.floor(code / 100)}xx`;
}

export default function HttpStatusCodes() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedCode, setExpandedCode] = useState<number | null>(null);

  const filteredCodes = useMemo(() => {
    let codes = STATUS_CODES;

    if (activeCategory !== "all") {
      const rangeDigit = activeCategory.charAt(0);
      codes = codes.filter((sc) => String(sc.code).charAt(0) === rangeDigit);
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      codes = codes.filter(
        (sc) =>
          String(sc.code).includes(query) ||
          sc.name.toLowerCase().includes(query) ||
          sc.description.toLowerCase().includes(query)
      );
    }

    return codes;
  }, [search, activeCategory]);

  const groupedCodes = useMemo(() => {
    const groups: Record<string, StatusCode[]> = {};
    for (const sc of filteredCodes) {
      const key = getCategoryKey(sc.code);
      if (!groups[key]) groups[key] = [];
      groups[key].push(sc);
    }
    return groups;
  }, [filteredCodes]);

  const categoryButtons = [
    { key: "all", label: "All", className: "bg-gray-100 text-gray-800 hover:bg-gray-200" },
    { key: "1xx", label: "1xx", className: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
    { key: "2xx", label: "2xx", className: "bg-green-100 text-green-800 hover:bg-green-200" },
    { key: "3xx", label: "3xx", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
    { key: "4xx", label: "4xx", className: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
    { key: "5xx", label: "5xx", className: "bg-red-100 text-red-800 hover:bg-red-200" },
  ];

  return (
    <ToolLayout
      title="HTTP Status Codes Reference"
      description="Complete reference of all HTTP status codes with descriptions, details, and search. Quickly look up any HTTP response code."
      relatedTools={["url-parser", "meta-tag-generator", "robots-txt-generator"]}
    >
      {/* Search */}
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Search Status Codes
      </label>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by code, name, or description... (e.g. 404, Not Found, timeout)"
        className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        spellCheck={false}
      />

      {/* Category filter buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categoryButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActiveCategory(btn.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              activeCategory === btn.key
                ? `${btn.className} ring-2 ring-offset-1 ring-gray-400`
                : `${btn.className} opacity-70`
            }`}
          >
            {btn.label}
            {btn.key === "all" && (
              <span className="ml-1 text-xs opacity-70">({filteredCodes.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Results count */}
      {search.trim() && (
        <div className="mb-4 text-sm text-gray-500">
          Found {filteredCodes.length} status code{filteredCodes.length !== 1 ? "s" : ""} matching &quot;{search}&quot;
        </div>
      )}

      {/* No results */}
      {filteredCodes.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
          No status codes found matching your search.
        </div>
      )}

      {/* Grouped status codes */}
      <div className="space-y-6">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const codes = groupedCodes[key];
          if (!codes || codes.length === 0) return null;

          return (
            <div key={key} className={`overflow-hidden rounded-lg border ${cat.borderColor}`}>
              {/* Category header */}
              <div className={`${cat.headerBg} ${cat.headerText} px-4 py-2.5`}>
                <h3 className="text-sm font-semibold">{cat.label}</h3>
              </div>

              {/* Status code list */}
              <div className="divide-y divide-gray-100">
                {codes.map((sc) => {
                  const isExpanded = expandedCode === sc.code;

                  return (
                    <div key={sc.code}>
                      <button
                        onClick={() =>
                          setExpandedCode(isExpanded ? null : sc.code)
                        }
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                          isExpanded ? "bg-gray-50" : ""
                        }`}
                      >
                        {/* Code badge */}
                        <span
                          className={`inline-flex shrink-0 items-center rounded-md px-2 py-1 text-sm font-bold ${cat.badgeBg} ${cat.badgeText}`}
                        >
                          {sc.code}
                        </span>

                        {/* Name and description */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${cat.color}`}>
                              {sc.name}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-600">
                            {sc.description}
                          </p>
                        </div>

                        {/* Expand indicator */}
                        <span className="mt-1 shrink-0 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </button>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className={`${cat.bgColor} border-t ${cat.borderColor} px-4 py-3`}>
                          <div className="ml-11">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {sc.details}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.badgeBg} ${cat.badgeText}`}>
                                {getCategoryKey(sc.code).toUpperCase()} {CATEGORIES[getCategoryKey(sc.code)].label.split(" ").slice(1).join(" ")}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                HTTP/1.1
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Understanding HTTP Status Codes
        </h2>
        <p className="mb-3">
          HTTP status codes are three-digit numbers returned by a server in response to a client&apos;s
          request. They indicate whether the request was successful, redirected, or resulted in an
          error. Understanding these codes is essential for web development, API design, and debugging
          network issues.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Status Code Categories
        </h2>
        <ul className="mb-3 list-inside list-disc space-y-1">
          <li>
            <strong>1xx Informational</strong> &mdash; The request was received and the process is
            continuing.
          </li>
          <li>
            <strong>2xx Success</strong> &mdash; The request was successfully received, understood,
            and accepted.
          </li>
          <li>
            <strong>3xx Redirection</strong> &mdash; Further action needs to be taken to complete
            the request.
          </li>
          <li>
            <strong>4xx Client Error</strong> &mdash; The request contains bad syntax or cannot be
            fulfilled by the server.
          </li>
          <li>
            <strong>5xx Server Error</strong> &mdash; The server failed to fulfill a valid request.
          </li>
        </ul>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Most Common Status Codes
        </h2>
        <p className="mb-3">
          The most frequently encountered status codes in everyday web development are{" "}
          <strong>200 OK</strong> (success), <strong>301 Moved Permanently</strong> (SEO redirects),{" "}
          <strong>304 Not Modified</strong> (caching), <strong>400 Bad Request</strong> (validation errors),{" "}
          <strong>401 Unauthorized</strong> (authentication), <strong>403 Forbidden</strong> (authorization),{" "}
          <strong>404 Not Found</strong> (missing resources), <strong>429 Too Many Requests</strong> (rate limiting),{" "}
          <strong>500 Internal Server Error</strong> (server bugs), and <strong>503 Service Unavailable</strong> (downtime).
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          HTTP Status Codes and SEO
        </h2>
        <p>
          Status codes play a critical role in SEO. Proper use of <strong>301 redirects</strong> preserves
          link equity when URLs change. Returning <strong>404</strong> for missing pages helps search
          engines clean their index. Using <strong>410 Gone</strong> signals permanent removal. Avoiding
          unnecessary <strong>302</strong> redirects prevents dilution of page authority. Server errors
          (5xx) can harm crawl efficiency and rankings if they persist.
        </p>
      </div>
    </ToolLayout>
  );
}
