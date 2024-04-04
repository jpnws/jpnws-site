import styles from "./Header.module.css";
import NavItem, { INavItem } from "./NavItem/NavItem";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import ThemeSwitcher from "./ThemeSwitcher/ThemeSwitcher";

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
        `${import.meta.env.VITE_API_URL}/api/globals/header?locale=undefined&draft=false&depth=1`,
      );
      const data = await response.json();
      setNavItems(data.navItems);
    };
    fetchData();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.innerContainer}>
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
            <ThemeSwitcher onThemeSwitcherClick={onThemeSwitcherClick} />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
