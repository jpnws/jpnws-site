import ExternalLinkIcon from "./ExternalLinkIcon";
import { INavItem } from "../NavItem/NavItem";
import styles from "./ExternalLink.module.css";

const ExternalLink = ({ navItem }: { navItem: INavItem }) => {
  return (
    <a
      href={navItem.link.url}
      className={styles.externalLink}
      target={navItem.link.newTab ? "_blank" : "_self"}
    >
      {navItem.link.label}
      <ExternalLinkIcon />
    </a>
  );
};

export default ExternalLink;