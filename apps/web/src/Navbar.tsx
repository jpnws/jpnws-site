import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  link: {
    label: string;
    reference: {
      relationTo: string;
      value: string;
    };
  };
}

const Navbar = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);

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
        return <li key={navItem.id}>{navItem.link.label}</li>;
      })}
    </ul>
  );
};

export default Navbar;
