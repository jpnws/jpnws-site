import { INavItem } from "./NavItem";
import styles from "./InternalLink.module.css";
import { Link } from "react-router-dom";

const InternalLink = ({ navItem }: { navItem: INavItem }) => {
  const link =
    navItem.link.reference.value.slug === "home"
      ? "/"
      : `/${navItem.link.reference.value.slug}`;
  return (
    <Link to={link} className={styles.internalLink}>
      {navItem.link.label}
    </Link>
  );
};

export default InternalLink;
