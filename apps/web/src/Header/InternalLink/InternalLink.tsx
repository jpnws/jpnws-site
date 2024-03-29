import { INavItem } from "../NavItem/NavItem";
import styles from "./InternalLink.module.css";

const InternalLink = ({ navItem }: { navItem: INavItem }) => {
  return <a className={styles.internalLink}>{navItem.link.label}</a>;
};

export default InternalLink;
