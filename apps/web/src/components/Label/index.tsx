import React from "react";

import classes from "./index.module.css";

export const Label: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <p className={classes.label}>{children}</p>;
};
