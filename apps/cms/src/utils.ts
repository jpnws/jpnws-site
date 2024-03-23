import type { FieldHook } from "payload/types";

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
const format = (val: string): string =>
  val
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();

/**
 * Field hook to format a slug based on the title.
 * @param field
 * @returns {FieldHook}
 * @example
 * ```ts
 * {
 *   name: "title",
 *   type: "text",
 *   required: true,
 *   hooks: {
 *     beforeChange: [formatSlug("title")],
 *   },
 * }
 */
export const formatSlug =
  (field: string): FieldHook =>
  async ({ data, operation, originalDoc, value }) => {
    if (operation === "create" || operation === "update") {
      return format(data?.[field] || originalDoc?.[field]);
    }
    return value;
  };

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 * @example
 * ```ts
 * isObject({}) // true
 * isObject([]) // false
 * isObject(null) // false
 * ```
 */
export function isObject(item: unknown): boolean {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 * @returns {T}
 * @example
 * ```ts
 * deepMerge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
 * deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
 * deepMerge({ a: { b: 1 } }, { a: { c: 2 } }) // { a: { b: 1, c: 2 } }
 * ```
 */
export function deepMerge<T, R>(target: T, source: R): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        // @ts-ignore
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
