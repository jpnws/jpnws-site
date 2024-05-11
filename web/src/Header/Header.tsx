import styles from "./Header.module.css";
import NavItem, { INavItem } from "./NavItem";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { Link } from "react-router-dom";
import { backendUrl } from "../utils";

const Header = ({
  onThemeSwitcherClick,
}: {
  onThemeSwitcherClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
}) => {
  const [navItems, setNavItems] = useState<INavItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${backendUrl}/api/globals/header?locale=undefined&draft=false&depth=1`,
      );
      const data = await response.json();
      setNavItems(data.navItems);
    };
    fetchData();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logoAndMenuContainer}>
        <Link to="/">
          <Logo width={32} height={32} />
        </Link>
        <nav className={styles.navContainer}>
          <ul className={styles.navItems}>
            {navItems.map((navItem) => {
              return <NavItem key={navItem.id} navItem={navItem} />;
            })}
          </ul>
        </nav>
        <div className={styles.hamburgerIconContainer}>
          <button className={styles.hamburgerIcon} onClick={toggleMenu}>
            {isOpen ? "🗙" : "☰"}
          </button>
        </div>
        <div className={styles.themeSwitcherContainer}>
          <ThemeSwitcher onThemeSwitcherClick={onThemeSwitcherClick} />
        </div>
      </div>
      {isOpen && (
        <nav className={styles.mobileNavContainer}>
          <ul className={styles.mobileNavItems}>
            {navItems.map((navItem) => {
              return <NavItem key={navItem.id} navItem={navItem} />;
            })}
          </ul>
          <ThemeSwitcher onThemeSwitcherClick={onThemeSwitcherClick} />
        </nav>
      )}
    </header>
  );
};

export default Header;
