import styles from "./Header.module.css";
import NavItem, { INavItem } from "./NavItem/NavItem";
import Logo from "./Logo";
import { useEffect, useState } from "react";

const Header = () => {
  const [navItems, setNavItems] = useState<INavItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/globals/header?locale=undefined&draft=false&depth=1`,
      );
      const data = await response.json();
      setNavItems(data.navItems);
    };
    fetchData();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logoAndMenuContainer}>
        <Logo width={32} height={32} />
        <div className={styles.hamburgerIconContainer}>
          <button className={styles.hamburgerIcon} onClick={toggleMenu}>
            {isOpen ? "🗙" : "☰"}
          </button>
        </div>
      </div>
      {isOpen && (
        <nav className={styles.mainNavContainer}>
          <ul className={styles.navItems}>
            {navItems.map((navItem) => {
              return <NavItem key={navItem.id} navItem={navItem} />;
            })}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
