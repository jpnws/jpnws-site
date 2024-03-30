import { useEffect, useState } from "react";
import { INavItem } from "./NavItem/NavItem";
import NavItem from "./NavItem/NavItem";
import styles from "./Navbar.module.css";

const Navbar = () => {
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
    <div>
      <div className={styles.hamburgerIconContainer}>
        <button className={styles.hamburgerIcon} onClick={toggleMenu}>
          {isOpen ? "🗙" : "☰"}
        </button>
      </div>
      {isOpen && (
        <nav className={styles.mainNavContainer}>
          <ul className={styles.navItems}>
            {navItems.map((navItem) => {
              return <NavItem navItem={navItem} />;
            })}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
