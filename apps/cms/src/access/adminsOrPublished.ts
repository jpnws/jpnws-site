import type { Access } from "payload/config";
import { checkRole } from "../collections/User/checkRole";

export const adminsOrPublished: Access = ({ req: { user } }) => {
  if (user && checkRole(["admin"], user)) {
    return true;
  }

  return {
    _status: {
      equals: "published",
    },
  };
};
