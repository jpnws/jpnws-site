import React from "react";

import classes from "./index.module.css";

export const LargeBody: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <p className={classes.largeBody}>{children}</p>;
};
