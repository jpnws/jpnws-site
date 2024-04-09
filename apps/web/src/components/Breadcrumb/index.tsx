import { Link, useLocation } from "react-router-dom";

import styles from "./Breadcrumb.module.css";
import BreadcrumbChevron from "./BreadcrumbChevron";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav aria-label="breadcrumb">
      <ul className={styles.breadcrumb}>
        {pathnames.length > 0 && (
          <li className={styles.breadcrumbItem}>
            <Link className={styles.link} to="/">
              Home
            </Link>
          </li>
        )}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return last ? (
            <li className={styles.breadcrumbItem} key={to}>
              <BreadcrumbChevron />
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </li>
          ) : (
            <li className={styles.breadcrumbItem} key={to}>
              <BreadcrumbChevron />
              <Link to={to}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
