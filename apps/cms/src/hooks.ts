import { FieldHookArgs } from "payload/dist/fields/config/types";

export const formatDate = (args: FieldHookArgs): string => {
  const date = new Date(args.value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
