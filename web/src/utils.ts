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
