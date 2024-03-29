import { useEffect, useState } from "react";
import { INavItem } from "./NavItem/NavItem";
import NavItem from "./NavItem/NavItem";

const Navbar = () => {
  const [navItems, setNavItems] = useState<INavItem[]>([]);

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
    <ul>
      {navItems.map((navItem) => {
        return <NavItem navItem={navItem} />;
      })}
    </ul>
  );
};

export default Navbar;
