import {
  backend_subdomain as backendSubdomain,
  domain_name as domainName,
} from "../../config.json";

/**
 * Format a string to be used as a slug.
 * @param val
 * @returns {string}
 * @example
 * ```ts
 * format("Hello World") // "hello-world"
 * format("Hello World!") // "hello-world"
 * ```
 */
export const formatSlug = (val: string): string =>
  val
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();

export const backendUrl =
  process.env.NODE_ENV === "production"
    ? `https://${backendSubdomain}.${domainName}`
    : import.meta.env.VITE_API_URL;
