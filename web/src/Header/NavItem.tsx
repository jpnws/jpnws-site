import InternalLink from "./InternalLink";
import ExternalLink from "./ExternalLink";

import styles from "./NavItem.module.css";

export interface INavItem {
  id: string;
  link: {
    type: "reference" | "external";
    newTab: boolean;
    url: string;
    label: string;
    reference: {
      relationTo: string;
      value: {
        slug: string;
      };
    };
  };
}

const NavItem = ({ navItem }: { navItem: INavItem }) => {
  return (
    <li className={styles.navItem}>
      {navItem.link.type === "reference" ? (
        <InternalLink navItem={navItem} />
      ) : (
        <ExternalLink navItem={navItem} header={true} />
      )}
    </li>
  );
};

export default NavItem;
