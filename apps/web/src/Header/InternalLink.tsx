import { INavItem } from "./NavItem";
import styles from "./InternalLink.module.css";

const InternalLink = ({ navItem }: { navItem: INavItem }) => {
  const link =
    navItem.link.reference.value.slug === "home"
      ? "/"
      : `/${navItem.link.reference.value.slug}`;
  return (
    <a href={`${link}`} className={styles.internalLink}>
      {navItem.link.label}
    </a>
  );
};

export default InternalLink;
